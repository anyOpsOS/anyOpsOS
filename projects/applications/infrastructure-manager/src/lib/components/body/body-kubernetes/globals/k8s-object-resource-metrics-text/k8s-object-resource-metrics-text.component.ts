import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'aaim-k8s-object-resource-metrics-text',
  templateUrl: './k8s-object-resource-metrics-text.component.html',
  styleUrls: ['./k8s-object-resource-metrics-text.component.scss']
})
export class K8sObjectResourceMetricsTextComponent implements OnInit {
  @Input() readonly metrics: unknown;

  constructor() { }

  ngOnInit(): void {
  }

}
