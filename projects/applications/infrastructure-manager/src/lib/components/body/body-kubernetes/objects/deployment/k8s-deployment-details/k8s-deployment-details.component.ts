import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';
import {AnyOpsOSLibNodeKubernetesObjectHelpersService} from '@anyopsos/lib-node-kubernetes';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {Pod} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';
import {Deployment} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/deployment';
import {ReplicaSet} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/replica-set';

@Component({
  selector: 'aaim-k8s-deployment-details',
  templateUrl: './k8s-deployment-details.component.html',
  styleUrls: ['./k8s-deployment-details.component.scss']
})
export class K8sDeploymentDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: Deployment } };

  isLoaded: boolean = false;
  childReplicaSets: (DataObject & { info: { data: ReplicaSet } })[];
  childPods: (DataObject & { info: { data: Pod } })[];

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService,
              public readonly LibNodeKubernetesObjectHelpers: AnyOpsOSLibNodeKubernetesObjectHelpersService) { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;

    this.childReplicaSets = this.LibNodeHelpers.getChildObjectsByType(this.k8sObject.info.mainUuid, 'kubernetes', 'RepplicaSet', this.k8sObject.info.obj);
    this.childPods = this.LibNodeHelpers.getChildObjectsByType(this.k8sObject.info.mainUuid, 'kubernetes', 'Pod', this.k8sObject.info.obj, true);
  }

  conditionClass(condition): string {
    return `${condition.status === 'False' ? 'disabled' : ''} ${condition.type.toLowerCase()}`
  }

  getConditions(activeOnly: boolean = false) {
    const {conditions} = this.k8sObject.info.data.status;
    if (!conditions) return []
    if (activeOnly) {
      return conditions.filter(c => c.status === 'True')
    }
    return conditions
  }

}
