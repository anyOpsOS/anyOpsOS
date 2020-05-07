import {WorkloadKubeObject} from './workload-kube-object';
import {Affinity} from './affinity';

export interface Deployment extends WorkloadKubeObject {
  kind: 'Deployment';
  spec: {
    replicas: number;
    selector: { matchLabels: { [app: string]: string } };
    template: {
      metadata: {
        creationTimestamp?: string;
        labels: { [app: string]: string };
      };
      spec: {
        containers: {
          name: string;
          image: string;
          args?: string[];
          ports?: {
            name: string;
            containerPort: number;
            protocol: string;
          }[];
          env?: {
            name: string;
            value: string;
          }[];
          resources: {
            limits?: {
              cpu: string;
              memory: string;
            };
            requests: {
              cpu: string;
              memory: string;
            };
          };
          volumeMounts?: {
            name: string;
            mountPath: string;
          }[];
          livenessProbe?: {
            httpGet: {
              path: string;
              port: number;
              scheme: string;
            };
            initialDelaySeconds: number;
            timeoutSeconds: number;
            periodSeconds: number;
            successThreshold: number;
            failureThreshold: number;
          };
          readinessProbe?: {
            httpGet: {
              path: string;
              port: number;
              scheme: string;
            };
            initialDelaySeconds: number;
            timeoutSeconds: number;
            periodSeconds: number;
            successThreshold: number;
            failureThreshold: number;
          };
          terminationMessagePath: string;
          terminationMessagePolicy: string;
          imagePullPolicy: string;
        }[];
        restartPolicy: string;
        terminationGracePeriodSeconds: number;
        dnsPolicy: string;
        affinity?: Affinity;
        nodeSelector?: {
          [selector: string]: string;
        };
        serviceAccountName: string;
        serviceAccount: string;
        securityContext: {};
        schedulerName: string;
        tolerations?: {
          key: string;
          operator: string;
          effect: string;
          tolerationSeconds: number;
        }[];
        volumes?: {
          name: string;
          configMap: {
            name: string;
            defaultMode: number;
            optional: boolean;
          };
        }[];
      };
    };
    strategy: {
      type: string;
      rollingUpdate: {
        maxUnavailable: number;
        maxSurge: number;
      };
    };
  }
  status: {
    observedGeneration: number;
    replicas: number;
    updatedReplicas: number;
    readyReplicas: number;
    availableReplicas?: number;
    unavailableReplicas?: number;
    conditions: {
      type: string;
      status: string;
      lastUpdateTime: string;
      lastTransitionTime: string;
      reason: string;
      message: string;
    }[];
  }
}