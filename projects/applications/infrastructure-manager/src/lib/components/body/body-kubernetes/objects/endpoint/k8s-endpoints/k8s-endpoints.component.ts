import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {Endpoint} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/endpoint';

@Component({
  selector: 'aaim-k8s-endpoints',
  templateUrl: './k8s-endpoints.component.html',
  styleUrls: ['./k8s-endpoints.component.scss']
})
export class K8sEndpointsComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  endpoints: (DataObject & { info: { data: Endpoint } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.endpoints);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.endpoints = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'Endpoint');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
