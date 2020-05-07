import { Component, Input } from '@angular/core';

@Component({
  selector: 'aaim-k8s-object-title',
  templateUrl: './k8s-object-title.component.html',
  styleUrls: ['./k8s-object-title.component.scss']
})
export class K8sObjectTitleComponent {
  @Input() readonly title: string;

  constructor() {}

}
