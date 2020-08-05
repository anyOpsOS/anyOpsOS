import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {Ingress} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/ingress';

@Component({
  selector: 'aaim-k8s-ingresses',
  templateUrl: './k8s-ingresses.component.html',
  styleUrls: ['./k8s-ingresses.component.scss']
})
export class K8sIngressesComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  ingresses: (DataObject & { info: { data: Ingress } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.ingresses);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.ingresses = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'Ingress');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRoutes(element: DataObject & { info: { data: Ingress } }): string[] {
    const { spec: { tls, rules } } = element.info.data;
    if (!rules) return [];

    let protocol = 'http';
    const routes: string[] = [];
    if (tls && tls.length > 0) {
      protocol += 's';
    }
    rules.map(rule => {
      const host = rule.host ? rule.host : '*';
      if (rule.http && rule.http.paths) {
        rule.http.paths.forEach(path => {
          routes.push(protocol + '://' + host + (path.path || '/') + ' ⇢ ' + path.backend.serviceName + ':' + path.backend.servicePort);
        });
      }
    });

    return routes;
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

}
