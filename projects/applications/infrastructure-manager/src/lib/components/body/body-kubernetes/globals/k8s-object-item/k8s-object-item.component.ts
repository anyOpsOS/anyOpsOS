import {Component, Input} from '@angular/core';

@Component({
  selector: 'aaim-k8s-object-item',
  templateUrl: './k8s-object-item.component.html',
  styleUrls: ['./k8s-object-item.component.scss']
})
export class K8sObjectItemComponent {
  @Input() readonly name: string;
  @Input() readonly labelsOnly: boolean;

  constructor() { }

}
