import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-resource-quota-details',
  templateUrl: './k8s-resource-quota-details.component.html',
  styleUrls: ['./k8s-resource-quota-details.component.scss']
})
export class K8sResourceQuotaDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
