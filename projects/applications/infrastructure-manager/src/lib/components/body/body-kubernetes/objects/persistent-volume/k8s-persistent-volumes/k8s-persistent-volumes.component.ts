import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {PersistentVolume} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/persistent-volume';

@Component({
  selector: 'aaim-k8s-persistent-volumes',
  templateUrl: './k8s-persistent-volumes.component.html',
  styleUrls: ['./k8s-persistent-volumes.component.scss']
})
export class K8sPersistentVolumesComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  persistentVolumes: (DataObject & { info: { data: PersistentVolume } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.persistentVolumes);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.persistentVolumes = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'PersistentVolume');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCapacity(volume: DataObject & { info: { data: PersistentVolume } }): number {
    const capacity = volume.info.data.spec.capacity;
    if (capacity) return capacity.storage;
    return 0;
  }

}
