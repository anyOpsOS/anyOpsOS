import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {KubeObject} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/kube-object';
import {KubeEvent} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/kube-event';

@Component({
  selector: 'aaim-k8s-object-events',
  templateUrl: './k8s-object-events.component.html',
  styleUrls: ['./k8s-object-events.component.scss']
})
export class K8sObjectEventsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: KubeObject } };

  k8sObjectEvents: (DataObject & { info: { data: KubeEvent } })[];

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.k8sObjectEvents = this.LibNodeHelpers.getObjectByCustomFilter(this.k8sObject.info.mainUuid, 'kubernetes', (imObj: DataObject) => {
      return imObj.type === 'Event' && imObj.info.data.involvedObject.uid === this.k8sObject.info.data.metadata.uid;
    });
  }

  getSource(evt: DataObject & { info: { data: KubeEvent } }): string {
    const { component, host } = evt.info.data.source;
    return `${component} ${host || ''}`;
  }

}
