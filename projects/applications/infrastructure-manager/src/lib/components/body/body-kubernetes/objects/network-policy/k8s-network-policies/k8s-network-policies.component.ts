import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {NetworkPolicy} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/network-policy';

@Component({
  selector: 'aaim-k8s-network-policies',
  templateUrl: './k8s-network-policies.component.html',
  styleUrls: ['./k8s-network-policies.component.scss']
})
export class K8sNetworkPoliciesComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  networkPolicies: (DataObject & { info: { data: NetworkPolicy } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.networkPolicies);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.networkPolicies = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'NetworkPolicy');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
