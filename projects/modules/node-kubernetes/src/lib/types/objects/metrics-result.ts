
export interface MetricsResult {
  metric: {
    [name: string]: string;
    instance: string;
    node?: string;
    pod?: string;
    kubernetes?: string;
    kubernetes_node?: string;
    kubernetes_namespace?: string;
  };
  values: [number, string][];
}