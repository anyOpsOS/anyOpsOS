import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeKubernetesObjectHelpersService} from '@anyopsos/lib-node-kubernetes';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';

@Component({
  selector: 'aaim-k8s-pod-details-affinities',
  templateUrl: './k8s-pod-details-affinities.component.html',
  styleUrls: ['./k8s-pod-details-affinities.component.scss']
})
export class K8sPodDetailsAffinitiesComponent implements OnInit {
  @Input() readonly k8sObject: DataObject;

  constructor(public readonly LibNodeKubernetesObjectHelpers: AnyOpsOSLibNodeKubernetesObjectHelpersService) { }

  ngOnInit(): void {
  }

}
