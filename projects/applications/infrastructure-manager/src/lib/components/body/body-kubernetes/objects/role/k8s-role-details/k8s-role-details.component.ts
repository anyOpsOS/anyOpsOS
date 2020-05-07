import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-role-details',
  templateUrl: './k8s-role-details.component.html',
  styleUrls: ['./k8s-role-details.component.scss']
})
export class K8sRoleDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
