import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';
import {AnyOpsOSLibNodeKubernetesObjectHelpersService} from '@anyopsos/lib-node-kubernetes';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {DaemonSet} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/daemon-set';
import {Pod} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';

@Component({
  selector: 'aaim-k8s-daemonset-details',
  templateUrl: './k8s-daemonset-details.component.html',
  styleUrls: ['./k8s-daemonset-details.component.scss']
})
export class K8sDaemonsetDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: DaemonSet } };

  isLoaded: boolean = false;
  childPods: (DataObject & { info: { data: Pod } })[];

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService,
              public readonly LibNodeKubernetesObjectHelpers: AnyOpsOSLibNodeKubernetesObjectHelpersService) { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;

    this.childPods = this.LibNodeHelpers.getChildObjectsByType(this.k8sObject.info.mainUuid, 'kubernetes', 'Pod', this.k8sObject.info.obj);
  }

}
