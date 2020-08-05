import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';
import {AnyOpsOSLibNodeKubernetesObjectHelpersService} from '@anyopsos/lib-node-kubernetes';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {Job} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/job';
import {Pod} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';

@Component({
  selector: 'aaim-k8s-job-details',
  templateUrl: './k8s-job-details.component.html',
  styleUrls: ['./k8s-job-details.component.scss']
})
export class K8sJobDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: Job } };

  isLoaded: boolean = false;
  childPods: (DataObject & { info: { data: Pod } })[];

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService,
              public readonly LibNodeKubernetesObjectHelpers: AnyOpsOSLibNodeKubernetesObjectHelpersService) { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;

    this.childPods = this.LibNodeHelpers.getChildObjectsByType(this.k8sObject.info.mainUuid, 'kubernetes', 'Pod', this.k8sObject.info.obj);
  }

  getConditions(): any[] {
    return (this.k8sObject.info.data.status.conditions || []).filter(c => c.status === 'True');
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

}
