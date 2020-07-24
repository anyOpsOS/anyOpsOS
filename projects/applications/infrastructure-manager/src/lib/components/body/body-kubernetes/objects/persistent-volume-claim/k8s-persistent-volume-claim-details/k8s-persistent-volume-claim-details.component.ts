import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {PersistentVolumeClaim} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/persistent-volume-claim';
import {Pod} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';

@Component({
  selector: 'aaim-k8s-persistent-volume-claim-details',
  templateUrl: './k8s-persistent-volume-claim-details.component.html',
  styleUrls: ['./k8s-persistent-volume-claim-details.component.scss']
})
export class K8sPersistentVolumeClaimDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: PersistentVolumeClaim } };

  isLoaded: boolean = false;
  childPods: (DataObject & { info: { data: Pod } })[];

  metricTabs: string[] = [
    'Disk'
  ];

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;

    this.childPods = this.LibNodeHelpers.getChildObjectsByType(this.k8sObject.info.mainUuid, 'kubernetes', 'Pod', this.k8sObject.info.obj);
  }

  getMatchLabels(): string[] {
    if (!this.k8sObject.info.data.spec.selector || !this.k8sObject.info.data.spec.selector.matchLabels) return [];
    return Object
      .entries(this.k8sObject.info.data.spec.selector.matchLabels)
      .map(([name, val]) => `${name}:${val}`);
  }

  getMatchExpressions(): [] {
    if (!this.k8sObject.info.data.spec.selector || !this.k8sObject.info.data.spec.selector.matchExpressions) return [];
    return this.k8sObject.info.data.spec.selector.matchExpressions;
  }

  // TODO
  goToElement() {
    return null;
  }

}
