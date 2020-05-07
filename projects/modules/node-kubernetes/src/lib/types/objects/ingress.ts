import {KubeObject} from './kube-object';

export interface Ingress extends KubeObject {
  kind: 'Ingress';
  spec: {
    tls: {
      secretName: string;
    }[];
    rules?: {
      host?: string;
      http: {
        paths: {
          path?: string;
          backend: {
            serviceName: string;
            servicePort: number;
          };
        }[];
      };
    }[];
    backend?: {
      serviceName: string;
      servicePort: number;
    };
  }
  status: {
    loadBalancer: {
      ingress: any[];
    };
  }
}