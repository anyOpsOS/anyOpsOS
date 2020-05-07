import {Component, OnInit, Input} from '@angular/core';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {Node} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/node';

@Component({
  selector: 'aaim-k8s-node-details',
  templateUrl: './k8s-node-details.component.html',
  styleUrls: ['./k8s-node-details.component.scss']
})
export class K8sNodeDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: Node } };

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
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

}
