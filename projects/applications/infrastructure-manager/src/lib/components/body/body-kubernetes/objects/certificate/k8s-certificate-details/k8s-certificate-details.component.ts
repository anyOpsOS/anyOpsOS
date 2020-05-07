import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-certificate-details',
  templateUrl: './k8s-certificate-details.component.html',
  styleUrls: ['./k8s-certificate-details.component.scss']
})
export class K8sCertificateDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
