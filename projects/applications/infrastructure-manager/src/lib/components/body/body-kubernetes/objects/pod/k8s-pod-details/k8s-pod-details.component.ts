import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-pod-details',
  templateUrl: './k8s-pod-details.component.html',
  styleUrls: ['./k8s-pod-details.component.scss']
})
export class K8sPodDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
