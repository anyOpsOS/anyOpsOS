import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'aaim-k8s-object-resource-metrics',
  templateUrl: './k8s-object-resource-metrics.component.html',
  styleUrls: ['./k8s-object-resource-metrics.component.scss']
})
export class K8sObjectResourceMetricsComponent implements OnInit {
  @Input() readonly loader;
  @Input() readonly tabs: string[];
  @Input() readonly object;
  @Input() readonly params;

  constructor() { }

  ngOnInit(): void {
  }

}
