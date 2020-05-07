import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-service-account-details',
  templateUrl: './k8s-service-account-details.component.html',
  styleUrls: ['./k8s-service-account-details.component.scss']
})
export class K8sServiceAccountDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
