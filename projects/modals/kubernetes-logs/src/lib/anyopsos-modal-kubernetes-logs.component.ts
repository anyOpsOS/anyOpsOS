import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@anyopsos/lib-angular-material';
import { BodyComponent, ModalData } from '@anyopsos/lib-modal';
import { DataObject } from '@anyopsos/backend-core/app/types/data-object';
import { AnyOpsOSLibNodeKubernetesApiService } from '@anyopsos/lib-node-kubernetes';
import { Pod } from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';
import { AnyOpsOSLibNodeHelpersService } from '@anyopsos/lib-node';

@Component({
  selector: 'amkubernetes-logs-anyopsos-modal-kubernetes-logs',
  templateUrl: './anyopsos-modal-kubernetes-logs.component.html',
  styleUrls: ['./anyopsos-modal-kubernetes-logs.component.scss']
})
export class AnyOpsOSModalKubernetesLogsComponent implements OnInit {
  @ViewChild('modalBody', { static: true }) modalBody: BodyComponent;

  object: DataObject & { info: { data: Pod } };

  private logRequests: {
    pod: any;
    container: any;
    logUuid: string;
  }[] = [];

  terminalUuid: string = null;
  foundPods: (DataObject & { info: { data: Pod } })[] = [];

  containerForm = new FormControl('');
  showContainersName: boolean = true;

  constructor(public readonly dialogRef: MatDialogRef<AnyOpsOSModalKubernetesLogsComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: ModalData,
              private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService,
              private readonly LibKubernetesApi: AnyOpsOSLibNodeKubernetesApiService) {

    this.object = data.object as DataObject & { info: { data: Pod } };

    this.containerForm.valueChanges.subscribe(selectedContainers => {

      // Reset deselected containers
      this.logRequests.forEach((request, index, object) => {
        const stillSelected = selectedContainers.find(container => {
          return container.pod.name === request.pod.name && container.container.name === request.container.name;
        });

        if (stillSelected) return;

        this.LibKubernetesApi.endContainerLogs(
          request.logUuid
        ).then(() => {

          // Delete object from array
          object.splice(index, 1);
        });
      });

      // Set new containers
      selectedContainers.forEach(container => {

        const alreadyExists = this.logRequests.find(request => {
          return container.pod.name === request.pod.name && container.container.name === request.container.name;
        });

        if (alreadyExists) return;

        this.LibKubernetesApi.getContainerLogsToSocket(
          container.pod.info.mainUuid,
          this.terminalUuid,
          container.pod.info.data.metadata.namespace,
          container.pod.name,
          container.container.name,
          this.showContainersName
        ).then((containerLogsData) => {

          this.logRequests.push({
            pod: container.pod,
            container: container.container,
            logUuid: containerLogsData.data.uuid
          });

        });
      });
    });
  }

  ngOnInit(): void {

    // Do not delete this
    this.modalBody.dialogRef = this.dialogRef;
    this.modalBody.title = this.data.title ?? 'Container Logs';
    this.modalBody.type = this.data.type;

    // @ts-ignore TODO
    if (this.object.type === 'Pod') return this.foundPods = [this.object];

    // Get Pods from parent object
    this.foundPods = this.LibNodeHelpers.getChildObjectsByType(this.object.info.mainUuid, 'kubernetes', 'Pod', this.object.info.obj);
  }

  terminalUuidChanged(terminalUuid: string): void {
    this.terminalUuid = terminalUuid;
  }

  showContainersNameChanged() {
    // Reset container logs and start again with correct showContainersName value
    this.logRequests.forEach((request) => {

      this.LibKubernetesApi.endContainerLogs(
        request.logUuid
      ).then(() => {
        this.LibKubernetesApi.getContainerLogsToSocket(
          request.pod.info.mainUuid,
          this.terminalUuid,
          request.pod.info.data.metadata.namespace,
          request.pod.name,
          request.container.name,
          this.showContainersName
        );
      });
    });
  }

}
