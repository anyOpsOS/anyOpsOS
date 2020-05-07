import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {Node} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/node';

@Component({
  selector: 'aaim-k8s-nodes',
  templateUrl: './k8s-nodes.component.html',
  styleUrls: ['./k8s-nodes.component.scss']
})
export class K8sNodesComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  nodes: (DataObject & { info: { data: Node } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.nodes);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.nodes = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'Node');
  }

  getRoleLabels(node: DataObject & { info: { data: Node } }): string {
    const roleLabels = Object.keys(node.info.data.metadata.labels).filter(key =>
      key.includes('node-role.kubernetes.io')
    ).map(key => key.match(/([^/]+$)/)[0]) // all after last slash

    if (node.info.data.metadata.labels['kubernetes.io/role'] !== undefined) {
      roleLabels.push(node.info.data.metadata.labels['kubernetes.io/role'])
    }

    return roleLabels.join(', ')
  }

  isUnschedulable(node: DataObject & { info: { data: Node } }): boolean {
    return node.info.data.spec.unschedulable
  }

  getConditions(node: DataObject & { info: { data: Node } }): { [key: string]: string; }[] {
    const conditions = node.info.data.status.conditions || [];
    if (this.isUnschedulable(node)) {
      return [{ type: 'SchedulingDisabled', status: 'True' }, ...conditions];
    }
    return conditions;
  }

  getActiveConditions(node: DataObject & { info: { data: Node } }): { [key: string]: string; }[] {
    return this.getConditions(node).filter(c => c.status === 'True');
  }

}
