import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@anyopsos/lib-angular-material';
import { BodyComponent, ModalData } from '@anyopsos/lib-modal';
import { ConnectionMonitor } from '@anyopsos/module-monitor';
import { AnyOpsOSLibServiceInjectorService } from '@anyopsos/lib-service-injector';

@Component({
  selector: 'ammonitor-import-anyopsos-modal-monitor-import',
  templateUrl: './anyopsos-modal-monitor-import.component.html',
  styleUrls: ['./anyopsos-modal-monitor-import.component.scss']
})
export class AnyOpsOSModalMonitorImportComponent implements OnInit {
  @ViewChild('modalBody', { static: true }) modalBody: BodyComponent;

  connection: ConnectionMonitor;

  private Monitor;
  NETDATA;
  Math = Math;

  snapshotStatusText: string = 'Browse for a snapshot file (or drag it and drop it here), then click <b>Import</b> to render it.';
  snapshotStatusType: string = 'info';

  readyToImport: boolean = false;
  fileName: string;
  fileResult = null;

  dateAfter;
  dateBefore;

  constructor(public readonly dialogRef: MatDialogRef<AnyOpsOSModalMonitorImportComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: ModalData,
              private serviceInjector: AnyOpsOSLibServiceInjectorService) {

    this.connection = data.connection;

    this.Monitor = this.serviceInjector.get('AnyOpsOSAppMonitorService');
  }

  ngOnInit(): void {

    // Do not delete this
    this.modalBody.dialogRef = this.dialogRef;
    this.modalBody.title = this.data.title ?? 'Import a Netdata snapshot';
    this.modalBody.type = this.data.type;

    this.NETDATA = this.connection.NETDATA;
  }

  loadSnapshotPreflight(fileInput: any) {
    const files = fileInput.target.files;
    if (files.length <= 0) {
      this.snapshotStatusText = 'No file selected';
      this.snapshotStatusType = 'danger';
      return;
    }

    this.snapshotStatusText = 'Loading file...';
    this.snapshotStatusType = 'info';

    this.loadSnapshotPreflightFile(files.item(0));
  }

  private loadSnapshotPreflightFile(file: File) {
    this.fileName = this.NETDATA.xss.string(file.name);
    const fr = new FileReader();

    fr.onload = (e: any) => {
      try {
        this.fileResult = this.NETDATA.xss.checkAlways('snapshot', JSON.parse(e.target.result), /^(snapshot\.info|snapshot\.data)$/);

        this.dateAfter = new Date(this.fileResult.after_ms);
        this.dateBefore = new Date(this.fileResult.before_ms);

        if (typeof this.fileResult.charts_ok === 'undefined') this.fileResult.charts_ok = 'unknown';
        if (typeof this.fileResult.charts_failed === 'undefined') this.fileResult.charts_failed = 0;
        if (typeof this.fileResult.compression === 'undefined') this.fileResult.compression = 'none';
        if (typeof this.fileResult.data_size === 'undefined') this.fileResult.data_size = 0;

        this.snapshotStatusText = 'File loaded, click <b>Import</b> to render it!';
        this.snapshotStatusType = 'success';

        this.readyToImport = true;
      } catch (e) {
        console.log(e);
        this.snapshotStatusText = 'Failed to parse this file!';
        this.snapshotStatusType = 'danger';
      }
    };

    fr.readAsText(file);
  }

  loadSnapshot() {
    this.readyToImport = false;

    if (this.fileResult === null) {
      this.snapshotStatusText = 'No data have been loaded';
      this.snapshotStatusType = 'danger';
      return;
    }

    this.snapshotStatusText = 'Please wait, activating snapshot...';
    this.snapshotStatusType = 'info';

    this.dialogRef.close();

    this.Monitor.connect({
      description: 'Netdata Snapshot',
      url: this.fileResult.server,
      credential: '',
      save: false,
      autologin: false,
      uuid: null,
      type: 'snapshot',
      snapshotData: this.fileResult
    });
  }

}
