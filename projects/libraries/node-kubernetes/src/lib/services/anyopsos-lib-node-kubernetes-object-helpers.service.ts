import { Injectable } from '@angular/core';

import { DataObject } from '@anyopsos/backend-core/app/types/data-object';
import { KubeObject } from '@anyopsos/module-node-kubernetes/src/lib/types/objects/kube-object';
import { Affinity } from '@anyopsos/module-node-kubernetes/src/lib/types/objects/affinity';
import { PodContainer } from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod-container';
import { Toleration } from '@anyopsos/module-node-kubernetes/src/lib/types/objects/toleration';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibNodeKubernetesObjectHelpersService {

  constructor() { }

  private isNonSystem(object: DataObject & { info: { data: KubeObject } }) {
    return !object.info.data.metadata.name.startsWith('system:');
  }

  private stringifyLabels(labels: { [name: string]: string }): string[] {
    if (!labels) return [];
    return Object.entries(labels).map(([name, value]) => `${name}=${value}`);
  }

  getSelectors(object: DataObject & { info: { data: KubeObject } }): string[] {
    const selector: { matchLabels: { [name: string]: string } } = object.info.data.spec.selector;
    return this.stringifyLabels(selector ? selector.matchLabels : null);
  }

  getNodeSelectors(object: DataObject & { info: { data: KubeObject } }): string[] {
    const nodeSelector: { [name: string]: string } = object.info.data.spec.template.spec.nodeSelector;
    return this.stringifyLabels(nodeSelector);
  }

  getTemplateLabels(object: DataObject & { info: { data: KubeObject } }): string[] {
    const labels: { [name: string]: string } = object.info.data.spec.template.metadata.labels;
    return this.stringifyLabels(labels);
  }

  getTolerations(object: DataObject & { info: { data: KubeObject } }): Toleration[] {
    return object.info.data.spec.template.spec.tolerations ?? [];
  }

  getAffinity(object: DataObject & { info: { data: KubeObject } }): Affinity {
    return object.info.data.spec.template.spec.affinity;
  }

  getAffinityNumber(object: DataObject & { info: { data: KubeObject } }): number {
    const affinity: Affinity = this.getAffinity(object);
    if (!affinity) return 0;
    return Object.keys(affinity).length;
  }

  getImages(object: DataObject & { info: { data: KubeObject } }): string[] {
    const containers: PodContainer[] = object.info.data.spec.template.spec.containers ?? [];
    const initContainers: PodContainer[] = object.info.data.spec.template.spec.initContainers ?? [];
    return [...containers, ...initContainers].map(container => container.image);
  }
}
