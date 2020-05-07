import {Component, OnInit, Input} from '@angular/core';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {Ingress} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/ingress';

@Component({
  selector: 'aaim-k8s-ingress-details',
  templateUrl: './k8s-ingress-details.component.html',
  styleUrls: ['./k8s-ingress-details.component.scss']
})
export class K8sIngressDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: Ingress } };

  isLoaded: boolean = false;

  displayedColumns: string[] = ['path', 'backends'];

  constructor() { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

  getPorts() {
    const ports: number[] = [];
    const { spec: { tls, rules, backend } } = this.k8sObject.info.data;
    const httpPort = 80;
    const tlsPort = 443;
    if (rules && rules.length > 0) {
      if (rules.some(rule => rule.hasOwnProperty('http'))) {
        ports.push(httpPort);
      }
    }
    else {
      if (backend && backend.servicePort) {
        ports.push(backend.servicePort);
      }
    }
    if (tls && tls.length > 0) {
      ports.push(tlsPort);
    }
    return ports.join(', ');
  }

}
