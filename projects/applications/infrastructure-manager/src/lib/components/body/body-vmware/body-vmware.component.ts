import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import {Application} from '@anyopsos/lib-application';
import {AnyOpsOSLibServiceInjectorService} from '@anyopsos/lib-service-injector';
import {AnyOpsOSLibNodeTemplateHelpersService} from '@anyopsos/lib-node';
import {AnyOpsOSExtLibNetdataService, NetdataConnection} from '@anyopsos/ext-lib-netdata';
import {DataObject} from '@anyopsos/backend-core/app/types/data-object';

import {AnyOpsOSAppInfrastructureManagerNodeMonitorService} from '../../../services/anyopsos-app-infrastructure-manager-node-monitor.service';


@Component({
  selector: 'aaim-body-vmware',
  templateUrl: './body-vmware.component.html',
  styleUrls: ['./body-vmware.component.scss']
})
export class BodyVmwareComponent implements OnChanges {
  @Input() vmwareObject: DataObject;
  @Input() application: Application;

  private Monitor;

  monitorConnection: NetdataConnection;

  constructor(private serviceInjector: AnyOpsOSLibServiceInjectorService,
              private Netdata: AnyOpsOSExtLibNetdataService,
              private InfrastructureManagerNodeMonitor: AnyOpsOSAppInfrastructureManagerNodeMonitorService,
              public readonly LibNodeTemplateHelpers: AnyOpsOSLibNodeTemplateHelpersService) {

    this.Monitor = this.serviceInjector.get('AnyOpsOSAppMonitorService');
  }

  ngOnChanges(changes: SimpleChanges): void {

    // Reset old Netdata Dashboard
    // TODO if old dashboard is active on Monitor Application, it will be reseated as well
    if (this.monitorConnection) {
      this.monitorConnection = undefined;
      this.Netdata.resetDashboard(changes.vmwareObject.previousValue);
    }

    // Set Netdata Monitor Dashboard
    if (this.haveMonitor) {
      const linkToMonitor = this.Monitor.getConnectionByLink(this.vmwareObject.info.uuid);
      if (linkToMonitor) this.monitorConnection = this.Netdata.newDashboard(linkToMonitor);
    }
  }

  haveMonitor(): boolean {
    return this.InfrastructureManagerNodeMonitor.haveMonitor(this.vmwareObject);
  }

}
