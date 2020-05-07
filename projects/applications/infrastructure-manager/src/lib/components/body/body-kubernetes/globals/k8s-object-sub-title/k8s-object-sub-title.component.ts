import {Component, Input} from '@angular/core';

@Component({
  selector: 'aaim-k8s-object-sub-title',
  templateUrl: './k8s-object-sub-title.component.html',
  styleUrls: ['./k8s-object-sub-title.component.scss']
})
export class K8sObjectSubTitleComponent {
  @Input() readonly title: string;

  constructor() { }

}
