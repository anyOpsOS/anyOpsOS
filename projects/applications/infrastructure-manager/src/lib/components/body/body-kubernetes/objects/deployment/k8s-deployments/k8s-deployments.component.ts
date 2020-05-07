import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {Deployment} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/deployment';
import {ReplicaSet} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/replica-set';

@Component({
  selector: 'aaim-k8s-deployments',
  templateUrl: './k8s-deployments.component.html',
  styleUrls: ['./k8s-deployments.component.scss']
})
export class K8sDeploymentsComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  deployments: (DataObject & { info: { data: Deployment } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.deployments);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.deployments = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'Deployment');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getChildReplicas(deployment: DataObject & { info: { data: Deployment } }): (DataObject & { info: { data: ReplicaSet } })[] {
    return this.LibNodeHelpers.getChildObjectsByType(deployment.info.mainUuid, 'kubernetes', 'ReplicaSet', deployment.info.obj);
  }

  getConditions(deployment: DataObject & { info: { data: Deployment } }): any[] {
    return (deployment.info.data.status.conditions || []).filter(c => c.status === 'True');
  }

}
