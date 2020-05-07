import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-service-details',
  templateUrl: './k8s-service-details.component.html',
  styleUrls: ['./k8s-service-details.component.scss']
})
export class K8sServiceDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
