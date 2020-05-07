import {Component, OnInit, Input} from '@angular/core';

import {Endpoint} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/endpoint';
import {DataObject} from '@anyopsos/backend-core/app/types/data-object';

@Component({
  selector: 'aaim-k8s-endpoint-details',
  templateUrl: './k8s-endpoint-details.component.html',
  styleUrls: ['./k8s-endpoint-details.component.scss']
})
export class K8sEndpointDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: Endpoint } };

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
