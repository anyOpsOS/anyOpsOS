import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {KubeEvent} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/kube-event';

@Component({
  selector: 'aaim-k8s-object-event-icon',
  templateUrl: './k8s-object-event-icon.component.html',
  styleUrls: ['./k8s-object-event-icon.component.scss']
})
export class K8sObjectEventIconComponent implements OnInit {
  @Input() readonly k8sObject: DataObject;
  @Input() readonly filterEvents?: (events: (DataObject & { info: { data: KubeEvent } })[]) => (DataObject & { info: { data: KubeEvent } })[];
  @Input() readonly showWarningsOnly?: boolean;

  event: DataObject & { info: { data: KubeEvent } };

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {

    const events: (DataObject & { info: { data: KubeEvent } })[] = this.LibNodeHelpers.getObjectByCustomFilter(this.k8sObject.info.mainUuid, 'kubernetes', (imObj: DataObject) => {
      return imObj.type === 'Event' && imObj.info.data.involvedObject.uid === this.k8sObject.info.data.metadata.uid;
    });

    let warnings: (DataObject & { info: { data: KubeEvent } })[] = events.filter(evt => evt.info.data.type === 'Warning');
    if (this.filterEvents) warnings = this.filterEvents(warnings);

    if (!events.length || (this.showWarningsOnly && !warnings.length)) {
      return this.event = null;
    }

    // get latest event
    this.event = [...warnings, ...events][0];
  }

  // TODO event.getAge();
  getMessage(): string {
    return `${this.event.info.data.message} &#13; ${this.event.info.data.metadata.creationTimestamp}`;
  }

  isWarning(): boolean {
    return this.event.info.data.type === 'Warning';
  }

}
