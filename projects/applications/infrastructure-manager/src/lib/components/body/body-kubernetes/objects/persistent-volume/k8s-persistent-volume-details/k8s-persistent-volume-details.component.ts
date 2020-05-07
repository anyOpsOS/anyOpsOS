import {Component, OnInit, Input} from '@angular/core';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {PersistentVolume} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/persistent-volume';

@Component({
  selector: 'aaim-k8s-persistent-volume-details',
  templateUrl: './k8s-persistent-volume-details.component.html',
  styleUrls: ['./k8s-persistent-volume-details.component.scss']
})
export class K8sPersistentVolumeDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: PersistentVolume } };

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
