import {Component, OnInit, Input, ViewChild} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {Endpoint} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/endpoint';
import {EndpointSubset} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/endpoint-subset';

@Component({
  selector: 'aaim-k8s-endpoint-subset-list',
  templateUrl: './k8s-endpoint-subset-list.component.html',
  styleUrls: ['./k8s-endpoint-subset-list.component.scss']
})
export class K8sEndpointSubsetListComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() readonly endpoint: DataObject & { info: { data: Endpoint } };
  @Input() readonly subset: EndpointSubset;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  readyDataSource = new MatTableDataSource(this.subset.addresses);
  notReadyDataSource = new MatTableDataSource(this.subset.notReadyAddresses);
  portsDataSource = new MatTableDataSource(this.subset.ports);

  constructor() { }

  ngOnInit(): void {
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

}
