import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-secret-details',
  templateUrl: './k8s-secret-details.component.html',
  styleUrls: ['./k8s-secret-details.component.scss']
})
export class K8sSecretDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
