import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { pairwise, startWith } from 'rxjs/operators';

import { MAT_DIALOG_DATA, MatDialogRef } from '@anyopsos/lib-angular-material';
import { BodyComponent, ModalData } from '@anyopsos/lib-modal';
import { AnyOpsOSLibNodeHelpersService } from '@anyopsos/lib-node';
import { AnyOpsOSLibNodeKubernetesApiService } from '@anyopsos/lib-node-kubernetes';
import { DataObject } from '@anyopsos/backend-core/app/types/data-object';
import { Pod } from '@anyopsos/module-node-kubernetes/src/lib/types/objects/pod';

@Component({
  selector: 'amkubernetes-shell-anyopsos-modal-kubernetes-shell',
  templateUrl: './anyopsos-modal-kubernetes-shell.component.html',
  styleUrls: ['./anyopsos-modal-kubernetes-shell.component.scss']
})
export class AnyOpsOSModalKubernetesShellComponent implements OnInit {
  @ViewChild('modalBody', { static: true }) modalBody: BodyComponent;

  object: DataObject;
  shellType: 'exec' | 'attach';

  terminalUuid: string = null;
  foundPods: (DataObject & { info: { data: Pod } })[] = [];

  containerForm = new FormControl('');

  constructor(public readonly dialogRef: MatDialogRef<AnyOpsOSModalKubernetesShellComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: ModalData,
              private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService,
              private readonly LibKubernetesApi: AnyOpsOSLibNodeKubernetesApiService) {

    this.object = data.object;
    this.shellType = data.shellType ?? 'attach';

    this.containerForm.valueChanges.pipe(startWith(null), pairwise()).subscribe(async ([previousData, selectedData]) => {

      // End previous shell
      if (previousData) await this.LibKubernetesApi.endContainerShell(this.terminalUuid);

      // Set new container shell
      this.LibKubernetesApi.getContainerShellToSocket(
        this.shellType,
        selectedData.pod.info.mainUuid,
        this.terminalUuid,
        selectedData.pod.info.data.metadata.namespace,
        selectedData.pod.name,
        selectedData.container.name,
        '/bin/sh'
      ).then(res => {
        console.log(res);
      });

    });
  }

  ngOnInit(): void {

    // Do not delete this
    this.modalBody.dialogRef = this.dialogRef;
    this.modalBody.title = this.data.title ?? 'Execute in Container';
    this.modalBody.type = this.data.type;

    // @ts-ignore TODO
    if (this.object.type === 'Pod') return this.foundPods = [this.object];

    // Get Pods from parent object
    this.foundPods = this.LibNodeHelpers.getChildObjectsByType(this.object.info.mainUuid, 'kubernetes', 'Pod', this.object.info.obj);
  }

  terminalUuidChanged(terminalUuid: string): void {
    this.terminalUuid = terminalUuid;
  }

}
