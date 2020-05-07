import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-pod-security-policy-details',
  templateUrl: './k8s-pod-security-policy-details.component.html',
  styleUrls: ['./k8s-pod-security-policy-details.component.scss']
})
export class K8sPodSecurityPolicyDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
