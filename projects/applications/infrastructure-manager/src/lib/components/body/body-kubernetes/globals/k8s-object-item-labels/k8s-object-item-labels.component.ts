import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'aaim-k8s-object-item-labels',
  templateUrl: './k8s-object-item-labels.component.html',
  styleUrls: ['./k8s-object-item-labels.component.scss']
})
export class K8sObjectItemLabelsComponent implements OnInit {
  @Input() readonly name: string;
  @Input() readonly labels: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
