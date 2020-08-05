import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {Pod} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';
import {PodStatus} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod-status';
import {WorkloadKubeObject} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/workload-kube-object';
import {PodContainerStatus} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod-container-status';


@Component({
  selector: 'aaim-k8s-pod-details-list',
  templateUrl: './k8s-pod-details-list.component.html',
  styleUrls: ['./k8s-pod-details-list.component.scss']
})
export class K8sPodDetailsListComponent implements OnInit {
  @Input() readonly owner: DataObject & { info: { data: WorkloadKubeObject } };
  @Input() readonly pods: (DataObject & { info: { data: Pod } })[];
  @Input() readonly maxCpu: number;
  @Input() readonly maxMemory: number;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.pods);

  constructor() { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  hasIssues(pod: DataObject & { info: { data: Pod } }) {
    const notReady = !!this.getConditions(pod).find(condition => {
      return condition.type === 'Ready' && condition.status !== 'True';
    });
    const crashLoop = !!this.getContainerStatuses(pod).find(condition => {
      const waiting = condition.state.waiting
      return (waiting && waiting.reason === 'CrashLoopBackOff')
    })
    return (
      notReady ||
      crashLoop ||
      this.getStatusPhase(pod) !== 'Running'
    )
  }

  getStatusPhase(pod: DataObject & { info: { data: Pod } }): string {
    return pod.info.data.status.phase;
  }

  getConditions(pod: DataObject & { info: { data: Pod } }): any[] {
    return pod.info.data.status.conditions || [];
  }

  getContainerStatuses(pod, includeInitContainers = true) {
    const statuses: PodContainerStatus[] = [];
    const { containerStatuses, initContainerStatuses } = pod.info.data.status;
    if (containerStatuses) {
      statuses.push(...containerStatuses);
    }
    if (includeInitContainers && initContainerStatuses) {
      statuses.push(...initContainerStatuses);
    }
    return statuses;
  }

  getStatusMessage(pod: DataObject & { info: { data: Pod } }): string {
    let message = '';
    const statuses = this.getContainerStatuses(false); // not including initContainers
    if (statuses.length) {
      statuses.forEach(status => {
        const { state } = status;
        if (state.waiting) {
          const { reason } = state.waiting;
          message = reason ? reason : 'Waiting';
        }
        if (state.terminated) {
          const { reason } = state.terminated;
          message = reason ? reason : 'Terminated';
        }
      })
    }
    if (this.getReason(pod) === PodStatus.EVICTED) return 'Evicted';
    if (message) return message;
    return this.getStatusPhase(pod);
  }
  
  getReason(pod: DataObject & { info: { data: Pod } }) {
    return pod.info.data.status.reason || '';
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

}
