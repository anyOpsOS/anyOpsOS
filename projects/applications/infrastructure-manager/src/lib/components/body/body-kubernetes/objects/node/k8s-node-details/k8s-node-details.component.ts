import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {AnyOpsOSAppInfrastructureManagerUtilsService} from './../../../../../../services/anyopsos-app-infrastructure-manager-utils.service';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {Node} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/node';
import {Pod} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';

@Component({
  selector: 'aaim-k8s-node-details',
  templateUrl: './k8s-node-details.component.html',
  styleUrls: ['./k8s-node-details.component.scss']
})
export class K8sNodeDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: Node } };

  isLoaded: boolean = false;
  childPods: (DataObject & { info: { data: Pod } })[];

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService,
              private readonly InfrastructureManagerUtils: AnyOpsOSAppInfrastructureManagerUtilsService) { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;

    this.childPods = this.LibNodeHelpers.getChildObjectsByType(this.k8sObject.info.mainUuid, 'kubernetes', 'Pod', this.k8sObject.info.obj);
  }

  isUnschedulable(): boolean {
    return this.k8sObject.info.data.spec.unschedulable
  }

  getConditions(): { [key: string]: string; }[] {
    const conditions = this.k8sObject.info.data.status.conditions || [];
    if (this.isUnschedulable()) {
      return [{ type: 'SchedulingDisabled', status: 'True' }, ...conditions];
    }
    return conditions;
  }

  getActiveConditions(): { [key: string]: string; }[] {
    return this.getConditions().filter(c => c.status === 'True');
  }

  getCpuCapacity() {
    if (!this.k8sObject.info.data.status.capacity || !this.k8sObject.info.data.status.capacity.cpu) return 0
    return this.InfrastructureManagerUtils.cpuUnitsToNumber(this.k8sObject.info.data.status.capacity.cpu)
  }

  getMemoryCapacity() {
    if (!this.k8sObject.info.data.status.capacity || !this.k8sObject.info.data.status.capacity.memory) return 0
    return this.InfrastructureManagerUtils.unitsToBytes(this.k8sObject.info.data.status.capacity.memory)
  }

  memoryParser(memory: string): number {
    return Math.floor(parseInt(memory, 10) / 1024);
  }

}
