import {KubeObject} from './kube-object';

export interface CustomResourceDefinition extends KubeObject {
  kind: 'CustomResourceDefinition';
  spec: {
    group: string;
    version: string;
    names: {
      plural: string;
      singular: string;
      kind: string;
      listKind: string;
    };
    scope: 'Namespaced' | 'Cluster' | string;
    validation?: any;
    versions: {
      name: string;
      served: boolean;
      storage: boolean;
    }[];
    conversion: {
      strategy?: string;
      webhook?: any;
    };
    additionalPrinterColumns?: {
      name: string;
      type: 'integer' | 'number' | 'string' | 'boolean' | 'date';
      priority: number;
      description: string;
      JSONPath: string;
    }[];
  }
  status: {
    conditions: {
      lastTransitionTime: string;
      message: string;
      reason: string;
      status: string;
      type: string;
    }[];
    acceptedNames: {
      plural: string;
      singular: string;
      kind: string;
      shortNames: string[];
      listKind: string;
    };
    storedVersions: string[];
  }
}