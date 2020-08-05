import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {Namespace} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/namespace';
import {ResourceQuota} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/resource-quota';

@Component({
  selector: 'aaim-k8s-namespace-details',
  templateUrl: './k8s-namespace-details.component.html',
  styleUrls: ['./k8s-namespace-details.component.scss']
})
export class K8sNamespaceDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: Namespace } };

  isLoaded: boolean = false;

  resourceQuotas: (DataObject & { info: { data: ResourceQuota } })[]

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;

    this.resourceQuotas = this.LibNodeHelpers.getChildObjectsByType(this.k8sObject.info.mainUuid, 'kubernetes', 'ResourceQuota', this.k8sObject.info.obj);
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

}
