import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {DaemonSet} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/daemon-set';
import {Pod} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';

@Component({
  selector: 'aaim-k8s-daemonsets',
  templateUrl: './k8s-daemonsets.component.html',
  styleUrls: ['./k8s-daemonsets.component.scss']
})
export class K8sDaemonsetsComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  daemonSets: (DataObject & { info: { data: DaemonSet } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.daemonSets);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.daemonSets = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'DaemonSet');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getChildPods(daemonSet: DataObject & { info: { data: DaemonSet } }): (DataObject & { info: { data: Pod } })[] {
    return this.LibNodeHelpers.getChildObjectsByType(daemonSet.info.mainUuid, 'kubernetes', 'Pod', daemonSet.info.obj);
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

}
