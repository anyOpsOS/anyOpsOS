import { Component, Input } from '@angular/core';
import { DataObject } from '@anyopsos/backend-core/app/types/data-object';

@Component({
  selector: 'aaim-k8s-object-metadata',
  templateUrl: './k8s-object-metadata.component.html',
  styleUrls: ['./k8s-object-metadata.component.scss']
})
export class K8sObjectMetadataComponent {
  @Input() readonly k8sObject: DataObject;

  constructor() { }

}
