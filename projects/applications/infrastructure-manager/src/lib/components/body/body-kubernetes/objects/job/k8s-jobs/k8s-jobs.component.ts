import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {Job} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/job';

@Component({
  selector: 'aaim-k8s-jobs',
  templateUrl: './k8s-jobs.component.html',
  styleUrls: ['./k8s-jobs.component.scss']
})
export class K8sJobsComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  jobs: (DataObject & { info: { data: Job } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.jobs);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.jobs = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'Job');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

  getCondition(element: DataObject & { info: { data: Job } }) {
    // Type of Job condition could be only Complete or Failed
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.14/#jobcondition-v1-batch
    const {conditions} = element.info.data.status;
    if (!conditions) return;
    return conditions.find(({ status }) => status === 'True');
  }

}
