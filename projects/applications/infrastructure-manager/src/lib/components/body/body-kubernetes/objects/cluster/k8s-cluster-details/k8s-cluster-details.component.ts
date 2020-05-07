import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aaim-k8s-cluster-details',
  templateUrl: './k8s-cluster-details.component.html',
  styleUrls: ['./k8s-cluster-details.component.scss']
})
export class K8sClusterDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
