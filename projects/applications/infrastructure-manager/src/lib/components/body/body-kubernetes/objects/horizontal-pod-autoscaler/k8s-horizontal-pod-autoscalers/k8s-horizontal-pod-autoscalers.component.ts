import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {HorizontalPodAutoscaler} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/horizontal-pod-autostaler';

@Component({
  selector: 'aaim-k8s-horizontal-pod-autoscalers',
  templateUrl: './k8s-horizontal-pod-autoscalers.component.html',
  styleUrls: ['./k8s-horizontal-pod-autoscalers.component.scss']
})
export class K8sHorizontalPodAutoscalersComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  horizontalPodAutoscalers: (DataObject & { info: { data: HorizontalPodAutoscaler } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.horizontalPodAutoscalers);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.horizontalPodAutoscalers = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'HorizontalPodAutoscaler');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getConditions(element: DataObject & { info: { data: HorizontalPodAutoscaler } }) {
    if (!element.info.data.status.conditions) return [];
    return element.info.data.conditions.map(condition => {
      const { message, reason, lastTransitionTime, status } = condition;
      return {
        ...condition,
        isReady: status === 'True',
        tooltip: `${message || reason} (${lastTransitionTime})`
      }
    });
  }

}
