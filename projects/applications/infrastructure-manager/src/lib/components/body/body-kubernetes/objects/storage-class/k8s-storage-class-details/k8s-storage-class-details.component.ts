import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'aaim-k8s-storage-class-details',
  templateUrl: './k8s-storage-class-details.component.html',
  styleUrls: ['./k8s-storage-class-details.component.scss']
})
export class K8sStorageClassDetailsComponent implements OnInit {

  isLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

}
