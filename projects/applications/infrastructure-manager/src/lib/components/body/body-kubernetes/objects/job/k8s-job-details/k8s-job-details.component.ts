import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeKubernetesObjectHelpersService} from '@anyopsos/lib-node-kubernetes';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {Job} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/job';

@Component({
  selector: 'aaim-k8s-job-details',
  templateUrl: './k8s-job-details.component.html',
  styleUrls: ['./k8s-job-details.component.scss']
})
export class K8sJobDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: Job } };

  isLoaded: boolean = false;

  constructor(public readonly LibNodeKubernetesObjectHelpers: AnyOpsOSLibNodeKubernetesObjectHelpersService) { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

  getConditions(): any[] {
    return (this.k8sObject.info.data.status.conditions || []).filter(c => c.status === 'True');
  }

}
