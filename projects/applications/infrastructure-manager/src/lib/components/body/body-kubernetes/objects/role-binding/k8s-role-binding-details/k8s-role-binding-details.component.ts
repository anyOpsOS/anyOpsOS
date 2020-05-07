import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-role-binding-details',
  templateUrl: './k8s-role-binding-details.component.html',
  styleUrls: ['./k8s-role-binding-details.component.scss']
})
export class K8sRoleBindingDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
