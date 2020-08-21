import {Component, OnInit, Input} from '@angular/core';

import {PodStatus} from '@anyopsos/module-node-kubernetes';

import {Pod} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';
import {DataObject} from '@anyopsos/backend-core/app/types/data-object';

@Component({
  selector: 'aaim-k8s-pod-details-statuses',
  templateUrl: './k8s-pod-details-statuses.component.html',
  styleUrls: ['./k8s-pod-details-statuses.component.scss']
})
export class K8sPodDetailsStatusesComponent implements OnInit {
  @Input() readonly pods: (DataObject & { info: { data: Pod } })[];

  statuses: { [key: string]: number } = {};

  constructor() { }

  ngOnInit(): void {

    // Count ocurrences in array
    this.pods.map(pod => this.getStatus(pod)).forEach((x) => this.statuses[x] = (this.statuses[x] || 0) + 1);
  }

  getStatusPhase(pod: DataObject & { info: { data: Pod } }): string {
    return pod.info.data.status.phase;
  }

  getConditions(pod: DataObject & { info: { data: Pod } }): any[] {
    return pod.info.data.status.conditions || [];
  }

  getReason(pod: DataObject & { info: { data: Pod } }): string {
    return pod.info.data.status.reason || '';
  }

  // Returns one of 5 statuses: Running, Succeeded, Pending, Failed, Evicted
  getStatus(pod: DataObject & { info: { data: Pod } }): PodStatus {
    const phase = this.getStatusPhase(pod);
    const reason = this.getReason(pod);
    const goodConditions = ['Initialized', 'Ready'].every(condition =>
      !!this.getConditions(pod).find(item => item.type === condition && item.status === 'True')
    );
    if (reason === PodStatus.EVICTED) {
      return PodStatus.EVICTED;
    }
    if (phase === PodStatus.FAILED) {
      return PodStatus.FAILED;
    }
    if (phase === PodStatus.SUCCEEDED) {
      return PodStatus.SUCCEEDED;
    }
    if (phase === PodStatus.RUNNING && goodConditions) {
      return PodStatus.RUNNING;
    }
    return PodStatus.PENDING;
  }

}
