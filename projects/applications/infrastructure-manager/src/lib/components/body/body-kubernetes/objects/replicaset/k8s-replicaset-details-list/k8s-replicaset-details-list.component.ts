import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ReplicaSet} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/replica-set';
import {Pod} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';

@Component({
  selector: 'aaim-k8s-replicaset-details-list',
  templateUrl: './k8s-replicaset-details-list.component.html',
  styleUrls: ['./k8s-replicaset-details-list.component.scss']
})
export class K8sReplicasetDetailsListComponent implements OnInit {
  @Input() readonly replicaSets: (DataObject & { info: { data: ReplicaSet } })[];
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.replicaSets);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getChildPods(replicaSet: DataObject & { info: { data: ReplicaSet } }): (DataObject & { info: { data: Pod } })[] {
    return this.LibNodeHelpers.getChildObjectsByType(replicaSet.info.mainUuid, 'kubernetes', 'Pod', replicaSet.info.obj);
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

}
