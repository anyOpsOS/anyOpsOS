import {Component, OnInit, Input} from '@angular/core';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {NetworkPolicy} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/network-policy';

@Component({
  selector: 'aaim-k8s-network-policy-details',
  templateUrl: './k8s-network-policy-details.component.html',
  styleUrls: ['./k8s-network-policy-details.component.scss']
})
export class K8sNetworkPolicyDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: NetworkPolicy } };

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

  getMatchLabels(): string[] {
    if (!this.k8sObject.info.data.spec.podSelector || !this.k8sObject.info.data.spec.podSelector.matchLabels) return [];
    return Object
      .entries(this.k8sObject.info.data.spec.podSelector.matchLabels)
      .map(data => data.join(':'));
  }

}
