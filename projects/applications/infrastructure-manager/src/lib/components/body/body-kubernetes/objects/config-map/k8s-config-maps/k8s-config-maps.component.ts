import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {ConfigMap} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/config-map';

@Component({
  selector: 'aaim-k8s-config-maps',
  templateUrl: './k8s-config-maps.component.html',
  styleUrls: ['./k8s-config-maps.component.scss']
})
export class K8sConfigMapsComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  configMaps: (DataObject & { info: { data: ConfigMap } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.configMaps);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.configMaps = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'ConfigMap');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

}
