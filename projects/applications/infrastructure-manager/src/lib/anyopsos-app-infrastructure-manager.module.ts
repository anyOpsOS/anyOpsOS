import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AnyOpsOSLibAngularMaterialModule} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibApplicationService} from '@anyopsos/lib-application';
import {AnyOpsOSLibServiceInjectorService} from '@anyopsos/lib-service-injector';
import {AnyOpsOSLibUtilsModule} from '@anyopsos/lib-utils';

import {ActionsComponent} from './components/actions/actions.component';
import {BodyComponent} from './components/body/body.component';
import {BodyNewConnectionComponent} from './components/body/body-new-connection/body-new-connection.component';
import {MenuComponent} from './components/menu/menu.component';
import {StatusComponent} from './components/status/status.component';

// Shared components
import {ChipsComponent} from './components/shared/chips/chips.component';

import {AnyOpsOSAppInfrastructureManagerService} from './services/anyopsos-app-infrastructure-manager.service';
import {AnyOpsOSAppInfrastructureManagerNodeGraphService} from './services/anyopsos-app-infrastructure-manager-node-graph.service';
import {AnyOpsOSAppInfrastructureManagerNodeLinkService} from './services/anyopsos-app-infrastructure-manager-node-link.service';

import {BodyVmwareComponent} from './components/body/body-vmware/body-vmware.component';
import {BodyNetappComponent} from './components/body/body-netapp/body-netapp.component';
import {BodyKubernetesComponent} from './components/body/body-kubernetes/body-kubernetes.component';
import {BodyDockerComponent} from './components/body/body-docker/body-docker.component';
import {BodyLinuxComponent} from './components/body/body-linux/body-linux.component';
import {BodySnmpComponent} from './components/body/body-snmp/body-snmp.component';

import {TabSummaryComponent} from './components/body/tabs/tab-summary/tab-summary.component';
import {TabMonitorComponent} from './components/body/tabs/tab-monitor/tab-monitor.component';
import {TabAlarmsComponent} from './components/body/tabs/tab-alarms/tab-alarms.component';
import {TabUpdatesComponent} from './components/body/tabs/tab-updates/tab-updates.component';
import {TabConfigureComponent} from './components/body/tabs/tab-configure/tab-configure.component';

// Kubernetes
import {ObjectListComponent} from './components/body/tabs/tab-summary/kubernetes/object-list/object-list.component';
import {KubernetesObjectDetailComponent} from './components/body/tabs/tab-summary/kubernetes/kubernetes-object-detail/kubernetes-object-detail.component';

// VMWare
import {VmwareRecentTasksComponent} from './components/body/vmware-recent-tasks/vmware-recent-tasks.component';

import {TagsComponent} from './components/body/tabs/tab-summary/vmware/tags/tags.component';
import {RelatedObjectsComponent} from './components/body/tabs/tab-summary/vmware/related-objects/related-objects.component';
import {CustomAttributesComponent} from './components/body/tabs/tab-summary/vmware/custom-attributes/custom-attributes.component';
import {VmStoragePoliciesComponent} from './components/body/tabs/tab-summary/vmware/vm-storage-policies/vm-storage-policies.component';
import {SummaryInfoComponent} from './components/body/tabs/tab-summary/vmware/summary-info/summary-info.component';

import {DatastoreClusterResourcesComponent} from './components/body/tabs/tab-summary/vmware/datastore-cluster-resources/datastore-cluster-resources.component';
import {VappStatusComponent} from './components/body/tabs/tab-summary/vmware/vapp-status/vapp-status.component';
import {ResourcePoolSettingsComponent} from './components/body/tabs/tab-summary/vmware/resource-pool-settings/resource-pool-settings.component';
import {HostHardwareComponent} from './components/body/tabs/tab-summary/vmware/host-hardware/host-hardware.component';
import {HostConfigurationComponent} from './components/body/tabs/tab-summary/vmware/host-configuration/host-configuration.component';
import {VsphereDrsComponent} from './components/body/tabs/tab-summary/vmware/vsphere-drs/vsphere-drs.component';
import {ClusterResourcesComponent} from './components/body/tabs/tab-summary/vmware/cluster-resources/cluster-resources.component';
import {ClusterConsumersComponent} from './components/body/tabs/tab-summary/vmware/cluster-consumers/cluster-consumers.component';
import {VcenterHaComponent} from './components/body/tabs/tab-summary/vmware/vcenter-ha/vcenter-ha.component';
import {VersionInformationComponent} from './components/body/tabs/tab-summary/vmware/version-information/version-information.component';
import {StorageDrsComponent} from './components/body/tabs/tab-summary/vmware/storage-drs/storage-drs.component';
import {SwitchFeaturesComponent} from './components/body/tabs/tab-summary/vmware/switch-features/switch-features.component';
import {AnyOpsOSLibDiagramModule} from '@anyopsos/lib-diagram';

import { K8sClusterDetailsComponent } from './components/body/body-kubernetes/objects/cluster/k8s-cluster-details/k8s-cluster-details.component';
import { K8sNodeDetailsComponent } from './components/body/body-kubernetes/objects/node/k8s-node-details/k8s-node-details.component';
import { K8sPodDetailsComponent } from './components/body/body-kubernetes/objects/pod/k8s-pod-details/k8s-pod-details.component';
import { K8sDeploymentDetailsComponent } from './components/body/body-kubernetes/objects/deployment/k8s-deployment-details/k8s-deployment-details.component';
import { K8sDaemonsetDetailsComponent } from './components/body/body-kubernetes/objects/daemonset/k8s-daemonset-details/k8s-daemonset-details.component';
import { K8sStatefulsetDetailsComponent } from './components/body/body-kubernetes/objects/statefulset/k8s-statefulset-details/k8s-statefulset-details.component';
import { K8sJobDetailsComponent } from './components/body/body-kubernetes/objects/job/k8s-job-details/k8s-job-details.component';
import { K8sCronJobDetailsComponent } from './components/body/body-kubernetes/objects/cron-job/k8s-cron-job-details/k8s-cron-job-details.component';
import { K8sConfigMapDetailsComponent } from './components/body/body-kubernetes/objects/config-map/k8s-config-map-details/k8s-config-map-details.component';
import { K8sSecretDetailsComponent } from './components/body/body-kubernetes/objects/secret/k8s-secret-details/k8s-secret-details.component';
import { K8sResourceQuotaDetailsComponent } from './components/body/body-kubernetes/objects/resource-quota/k8s-resource-quota-details/k8s-resource-quota-details.component';
import { K8sCertificateDetailsComponent } from './components/body/body-kubernetes/objects/certificate/k8s-certificate-details/k8s-certificate-details.component';
import { K8sHorizontalPodAutoscalerDetailsComponent } from './components/body/body-kubernetes/objects/horizontal-pod-autoscaler/k8s-horizontal-pod-autoscaler-details/k8s-horizontal-pod-autoscaler-details.component';
import { K8sServiceDetailsComponent } from './components/body/body-kubernetes/objects/service/k8s-service-details/k8s-service-details.component';
import { K8sIngressDetailsComponent } from './components/body/body-kubernetes/objects/ingress/k8s-ingress-details/k8s-ingress-details.component';
import { K8sNetworkPolicyDetailsComponent } from './components/body/body-kubernetes/objects/network-policy/k8s-network-policy-details/k8s-network-policy-details.component';
import { K8sEndpointDetailsComponent } from './components/body/body-kubernetes/objects/endpoint/k8s-endpoint-details/k8s-endpoint-details.component';
import { K8sPersistentVolumeDetailsComponent } from './components/body/body-kubernetes/objects/persistent-volume/k8s-persistent-volume-details/k8s-persistent-volume-details.component';
import { K8sPersistentVolumeClaimDetailsComponent } from './components/body/body-kubernetes/objects/persistent-volume-claim/k8s-persistent-volume-claim-details/k8s-persistent-volume-claim-details.component';
import { K8sStorageClassDetailsComponent } from './components/body/body-kubernetes/objects/storage-class/k8s-storage-class-details/k8s-storage-class-details.component';
import { K8sNamespaceDetailsComponent } from './components/body/body-kubernetes/objects/namespace/k8s-namespace-details/k8s-namespace-details.component';
import { K8sServiceAccountDetailsComponent } from './components/body/body-kubernetes/objects/service-account/k8s-service-account-details/k8s-service-account-details.component';
import { K8sRoleBindingDetailsComponent } from './components/body/body-kubernetes/objects/role-binding/k8s-role-binding-details/k8s-role-binding-details.component';
import { K8sRoleDetailsComponent } from './components/body/body-kubernetes/objects/role/k8s-role-details/k8s-role-details.component';
import { K8sPodSecurityPolicyDetailsComponent } from './components/body/body-kubernetes/objects/pod/k8s-pod-security-policy-details/k8s-pod-security-policy-details.component';
import { K8sClusterIssuesComponent } from './components/body/body-kubernetes/objects/cluster/k8s-cluster-details/k8s-cluster-issues/k8s-cluster-issues.component';
import { K8sClusterMetricsComponent } from './components/body/body-kubernetes/objects/cluster/k8s-cluster-details/k8s-cluster-metrics/k8s-cluster-metrics.component';
import { K8sClusterPieChartsComponent } from './components/body/body-kubernetes/objects/cluster/k8s-cluster-details/k8s-cluster-pie-charts/k8s-cluster-pie-charts.component';
import { K8sObjectTitleComponent } from './components/body/body-kubernetes/globals/k8s-object-title/k8s-object-title.component';
import { K8sObjectMetadataComponent } from './components/body/body-kubernetes/globals/k8s-object-metadata/k8s-object-metadata.component';
import { K8sObjectItemComponent } from './components/body/body-kubernetes/globals/k8s-object-item/k8s-object-item.component';
import { K8sObjectEventsComponent } from './components/body/body-kubernetes/globals/k8s-object-events/k8s-object-events.component';
import { K8sPodDetailsTolerationsComponent } from './components/body/body-kubernetes/objects/pod/k8s-pod-details-tolerations/k8s-pod-details-tolerations.component';
import { K8sPodDetailsAffinitiesComponent } from './components/body/body-kubernetes/objects/pod/k8s-pod-details-affinities/k8s-pod-details-affinities.component';
import { K8sPodDetailsListComponent } from './components/body/body-kubernetes/objects/pod/k8s-pod-details-list/k8s-pod-details-list.component';
import { K8sObjectParamTogglerComponent } from './components/body/body-kubernetes/globals/k8s-object-param-toggler/k8s-object-param-toggler.component';
import { K8sObjectResourceMetricsTextComponent } from './components/body/body-kubernetes/globals/k8s-object-resource-metrics-text/k8s-object-resource-metrics-text.component';
import { K8sPodDetailsStatusesComponent } from './components/body/body-kubernetes/objects/pod/k8s-pod-details-statuses/k8s-pod-details-statuses.component';
import { K8sObjectResourceMetricsComponent } from './components/body/body-kubernetes/globals/k8s-object-resource-metrics/k8s-object-resource-metrics.component';
import { K8sPodDetailsChartsComponent } from './components/body/body-kubernetes/objects/pod/k8s-pod-details-charts/k8s-pod-details-charts.component';
import { K8sObjectEventIconComponent } from './components/body/body-kubernetes/globals/k8s-object-event-icon/k8s-object-event-icon.component';
import { K8sReplicasetDetailsListComponent } from './components/body/body-kubernetes/objects/replicaset/k8s-replicaset-details-list/k8s-replicaset-details-list.component';
import { K8sConfigMapsComponent } from './components/body/body-kubernetes/objects/config-map/k8s-config-maps/k8s-config-maps.component';
import { K8sCronJobsComponent } from './components/body/body-kubernetes/objects/cron-job/k8s-cron-jobs/k8s-cron-jobs.component';
import { K8sDaemonsetsComponent } from './components/body/body-kubernetes/objects/daemonset/k8s-daemonsets/k8s-daemonsets.component';
import { K8sDeploymentsComponent } from './components/body/body-kubernetes/objects/deployment/k8s-deployments/k8s-deployments.component';
import { K8sEndpointsComponent } from './components/body/body-kubernetes/objects/endpoint/k8s-endpoints/k8s-endpoints.component';
import { K8sEndpointSubsetListComponent } from './components/body/body-kubernetes/objects/endpoint/k8s-endpoint-subset-list/k8s-endpoint-subset-list.component';
import { K8sHorizontalPodAutoscalersComponent } from './components/body/body-kubernetes/objects/horizontal-pod-autoscaler/k8s-horizontal-pod-autoscalers/k8s-horizontal-pod-autoscalers.component';
import { K8sObjectBadgeComponent } from './components/body/body-kubernetes/globals/k8s-object-badge/k8s-object-badge.component';
import { K8sObjectItemLabelsComponent } from './components/body/body-kubernetes/globals/k8s-object-item-labels/k8s-object-item-labels.component';
import { K8sIngressDetailsChartsComponent } from './components/body/body-kubernetes/objects/ingress/k8s-ingress-details-charts/k8s-ingress-details-charts.component';
import { K8sIngressesComponent } from './components/body/body-kubernetes/objects/ingress/k8s-ingresses/k8s-ingresses.component';
import { K8sJobsComponent } from './components/body/body-kubernetes/objects/job/k8s-jobs/k8s-jobs.component';
import { K8sNamespacesComponent } from './components/body/body-kubernetes/objects/namespace/k8s-namespaces/k8s-namespaces.component';
import { K8sObjectSubTitleComponent } from './components/body/body-kubernetes/globals/k8s-object-sub-title/k8s-object-sub-title.component';
import { K8sNetworkPoliciesComponent } from './components/body/body-kubernetes/objects/network-policy/k8s-network-policies/k8s-network-policies.component';
import { K8sNodeDetailsChartsComponent } from './components/body/body-kubernetes/objects/node/k8s-node-details-charts/k8s-node-details-charts.component';
import { K8sNodesComponent } from './components/body/body-kubernetes/objects/node/k8s-nodes/k8s-nodes.component';
import { K8sPersistentVolumesComponent } from './components/body/body-kubernetes/objects/persistent-volume/k8s-persistent-volumes/k8s-persistent-volumes.component';
import { K8sPersistentVolumeClaimsComponent } from './components/body/body-kubernetes/objects/persistent-volume-claim/k8s-persistent-volume-claims/k8s-persistent-volume-claims.component';
import { K8sResourceQuotasComponent } from './components/body/body-kubernetes/objects/resource-quota/k8s-resource-quotas/k8s-resource-quotas.component';
import { K8sRolesComponent } from './components/body/body-kubernetes/objects/role/k8s-roles/k8s-roles.component';
import { K8sRoleBindingsComponent } from './components/body/body-kubernetes/objects/role-binding/k8s-role-bindings/k8s-role-bindings.component';
import { K8sSecretsComponent } from './components/body/body-kubernetes/objects/secret/k8s-secrets/k8s-secrets.component';
import { K8sServicesComponent } from './components/body/body-kubernetes/objects/service/k8s-services/k8s-services.component';
import { K8sServiceAccountsComponent } from './components/body/body-kubernetes/objects/service-account/k8s-service-accounts/k8s-service-accounts.component';
import { K8sStatefulsetsComponent } from './components/body/body-kubernetes/objects/statefulset/k8s-statefulsets/k8s-statefulsets.component';
import { K8sStorageClassesComponent } from './components/body/body-kubernetes/objects/storage-class/k8s-storage-classes/k8s-storage-classes.component';
import { K8sPersistentVolumeClaimDiskChartComponent } from './components/body/body-kubernetes/objects/persistent-volume-claim/k8s-persistent-volume-claim-disk-chart/k8s-persistent-volume-claim-disk-chart.component';

@NgModule({
  declarations: [
    ActionsComponent,
    BodyComponent,
    BodyNewConnectionComponent,
    MenuComponent,
    StatusComponent,

    ChipsComponent,

    BodyVmwareComponent,
    BodyNetappComponent,
    BodyKubernetesComponent,
    BodyDockerComponent,
    BodyLinuxComponent,
    BodySnmpComponent,

    TabSummaryComponent,
    TabMonitorComponent,
    TabAlarmsComponent,
    TabUpdatesComponent,
    TabConfigureComponent,

    KubernetesObjectDetailComponent,
    ObjectListComponent,

    VmwareRecentTasksComponent,

    TagsComponent,
    RelatedObjectsComponent,
    CustomAttributesComponent,
    VmStoragePoliciesComponent,
    SummaryInfoComponent,

    DatastoreClusterResourcesComponent,
    VappStatusComponent,
    ResourcePoolSettingsComponent,
    HostHardwareComponent,
    HostConfigurationComponent,
    VsphereDrsComponent,
    ClusterResourcesComponent,
    ClusterConsumersComponent,
    VcenterHaComponent,
    VersionInformationComponent,
    StorageDrsComponent,
    SwitchFeaturesComponent,

    K8sClusterDetailsComponent,
    K8sNodeDetailsComponent,
    K8sPodDetailsComponent,
    K8sDeploymentDetailsComponent,
    K8sDaemonsetDetailsComponent,
    K8sStatefulsetDetailsComponent,
    K8sJobDetailsComponent,
    K8sCronJobDetailsComponent,
    K8sConfigMapDetailsComponent,
    K8sSecretDetailsComponent,
    K8sResourceQuotaDetailsComponent,
    K8sCertificateDetailsComponent,
    K8sHorizontalPodAutoscalerDetailsComponent,
    K8sServiceDetailsComponent,
    K8sIngressDetailsComponent,
    K8sNetworkPolicyDetailsComponent,
    K8sEndpointDetailsComponent,
    K8sPersistentVolumeDetailsComponent,
    K8sPersistentVolumeClaimDetailsComponent,
    K8sStorageClassDetailsComponent,
    K8sNamespaceDetailsComponent,
    K8sServiceAccountDetailsComponent,
    K8sRoleBindingDetailsComponent,
    K8sRoleDetailsComponent,
    K8sPodSecurityPolicyDetailsComponent,
    K8sClusterIssuesComponent,
    K8sClusterMetricsComponent,
    K8sClusterPieChartsComponent,
    K8sObjectTitleComponent,
    K8sObjectMetadataComponent,
    K8sObjectItemComponent,
    K8sObjectEventsComponent,
    K8sPodDetailsTolerationsComponent,
    K8sPodDetailsAffinitiesComponent,
    K8sPodDetailsListComponent,
    K8sObjectParamTogglerComponent,
    K8sObjectResourceMetricsTextComponent,
    K8sPodDetailsStatusesComponent,
    K8sObjectResourceMetricsComponent,
    K8sPodDetailsChartsComponent,
    K8sObjectEventIconComponent,
    K8sReplicasetDetailsListComponent,
    K8sConfigMapsComponent,
    K8sCronJobsComponent,
    K8sDaemonsetsComponent,
    K8sDeploymentsComponent,
    K8sEndpointsComponent,
    K8sEndpointSubsetListComponent,
    K8sHorizontalPodAutoscalersComponent,
    K8sObjectBadgeComponent,
    K8sObjectItemLabelsComponent,
    K8sIngressDetailsChartsComponent,
    K8sIngressesComponent,
    K8sJobsComponent,
    K8sNamespacesComponent,
    K8sObjectSubTitleComponent,
    K8sNetworkPoliciesComponent,
    K8sNodeDetailsChartsComponent,
    K8sNodesComponent,
    K8sPersistentVolumesComponent,
    K8sPersistentVolumeClaimsComponent,
    K8sResourceQuotasComponent,
    K8sRolesComponent,
    K8sRoleBindingsComponent,
    K8sSecretsComponent,
    K8sServicesComponent,
    K8sServiceAccountsComponent,
    K8sStatefulsetsComponent,
    K8sStorageClassesComponent,
    K8sPersistentVolumeClaimDiskChartComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // Shared module import
        AnyOpsOSLibAngularMaterialModule,
        AnyOpsOSLibUtilsModule,
        AnyOpsOSLibDiagramModule
    ],
  exports: []
})
export class AnyOpsOSAppInfrastructureManagerModule {
  constructor(private serviceInjector: AnyOpsOSLibServiceInjectorService,
              private readonly LibApplication: AnyOpsOSLibApplicationService,
              private InfrastructureManager: AnyOpsOSAppInfrastructureManagerService,
              private InfrastructureManagerNodeLink: AnyOpsOSAppInfrastructureManagerNodeLinkService,
              private InfrastructureManagerNodeGraph: AnyOpsOSAppInfrastructureManagerNodeGraphService) {

    this.serviceInjector.set('AnyOpsOSAppInfrastructureManagerService', this.InfrastructureManager);
    this.serviceInjector.set('AnyOpsOSAppInfrastructureManagerNodeLinkService', this.InfrastructureManagerNodeLink);
    this.serviceInjector.set('AnyOpsOSAppInfrastructureManagerNodeGraphService', this.InfrastructureManagerNodeGraph);

    this.LibApplication.registerApplication({
      uuid: 'infrastructure-manager',
      ico: 'fas fa-server',
      name: 'Infrastructure Manager',
      menu: true,
      actions: true,
      status: true,
      style: {width: '1700px', height: '800px', top: '4%', left: '7%'}
    });
  }
}
