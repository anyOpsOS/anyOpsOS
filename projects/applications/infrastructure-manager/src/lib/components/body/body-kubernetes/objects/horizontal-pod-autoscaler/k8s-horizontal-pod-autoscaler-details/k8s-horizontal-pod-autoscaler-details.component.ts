import {Component, OnInit, Input} from '@angular/core';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {HorizontalPodAutoscaler} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/horizontal-pod-autostaler';

@Component({
  selector: 'aaim-k8s-horizontal-pod-autoscaler-details',
  templateUrl: './k8s-horizontal-pod-autoscaler-details.component.html',
  styleUrls: ['./k8s-horizontal-pod-autoscaler-details.component.scss']
})
export class K8sHorizontalPodAutoscalerDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: HorizontalPodAutoscaler } };

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

  getConditions() {
    if (!this.k8sObject.info.data.status.conditions) return [];

    return this.k8sObject.info.data.status.conditions.map(condition => {
      const { message, reason, lastTransitionTime, status } = condition;
      return {
        ...condition,
        isReady: status === 'True',
        tooltip: `${message || reason} (${lastTransitionTime})`
      }
    });
  }

  // TODO
  goToElement() {
    return null;
  }

}
