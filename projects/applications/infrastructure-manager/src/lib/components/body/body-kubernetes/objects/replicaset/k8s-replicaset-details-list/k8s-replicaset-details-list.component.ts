import {Component, OnInit, Input} from '@angular/core';

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

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
  }

  getChildPods(replicaSet: DataObject & { info: { data: ReplicaSet } }): (DataObject & { info: { data: Pod } })[] {
    return this.LibNodeHelpers.getChildObjectsByType(replicaSet.info.mainUuid, 'kubernetes', 'Pod', replicaSet.info.obj);
  }

}
