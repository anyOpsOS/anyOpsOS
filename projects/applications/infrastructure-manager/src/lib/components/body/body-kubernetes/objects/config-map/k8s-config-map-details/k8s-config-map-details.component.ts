import {Component, OnInit, Input} from '@angular/core';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConfigMap} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/config-map';

@Component({
  selector: 'aaim-k8s-config-map-details',
  templateUrl: './k8s-config-map-details.component.html',
  styleUrls: ['./k8s-config-map-details.component.scss']
})
export class K8sConfigMapDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: ConfigMap } };

  isLoaded: boolean = false;
  savingData: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

  save(): void {
    // TODO
    this.savingData = true;
  }

}
