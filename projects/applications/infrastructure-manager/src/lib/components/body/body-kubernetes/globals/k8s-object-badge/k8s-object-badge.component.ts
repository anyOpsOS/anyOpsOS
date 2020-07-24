import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'aaim-k8s-object-badge',
  templateUrl: './k8s-object-badge.component.html',
  styleUrls: ['./k8s-object-badge.component.scss']
})
export class K8sObjectBadgeComponent implements OnInit {
  @Input() readonly label: string;

  constructor() { }

  ngOnInit(): void {
  }

}
