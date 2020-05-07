import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-statefulset-details',
  templateUrl: './k8s-statefulset-details.component.html',
  styleUrls: ['./k8s-statefulset-details.component.scss']
})
export class K8sStatefulsetDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
