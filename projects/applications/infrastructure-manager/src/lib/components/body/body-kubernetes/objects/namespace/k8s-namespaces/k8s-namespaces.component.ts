import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {Namespace} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/namespace';

@Component({
  selector: 'aaim-k8s-namespaces',
  templateUrl: './k8s-namespaces.component.html',
  styleUrls: ['./k8s-namespaces.component.scss']
})
export class K8sNamespacesComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  namespaces: (DataObject & { info: { data: Namespace } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.namespaces);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.namespaces = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'Namespace');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
