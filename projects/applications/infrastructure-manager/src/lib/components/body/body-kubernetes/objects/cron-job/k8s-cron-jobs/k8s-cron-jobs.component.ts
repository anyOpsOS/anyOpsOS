import {Component, OnInit, ViewChild, Input} from '@angular/core';

import {MatTableDataSource, MatSort} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {ConnectionKubernetes} from '@anyopsos/module-node-kubernetes';
import {CronJob} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/cron-job';
import {Job} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/job';

@Component({
  selector: 'aaim-k8s-cron-jobs',
  templateUrl: './k8s-cron-jobs.component.html',
  styleUrls: ['./k8s-cron-jobs.component.scss']
})
export class K8sCronJobsComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private readonly connection: ConnectionKubernetes;

  cronJobs: (DataObject & { info: { data: CronJob } })[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.cronJobs);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    this.cronJobs = this.LibNodeHelpers.getObjectByTypeInConnection(this.connection.uuid, this.connection.type, 'CronJob');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isNeverRun(cronJob: DataObject & { info: { data: CronJob } }): boolean {
    const schedule = cronJob.info.data.spec.schedule;
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const stamps = schedule.split(' ');
    const day = Number(stamps[stamps.length - 3]);  // 1-31
    const month = Number(stamps[stamps.length - 2]);  // 1-12
    if (schedule.startsWith('@')) return false;
    return day > daysInMonth[month - 1];
  }

  // Active jobs are jobs without any condition 'Complete' nor 'Failed'
  getActiveJobsNum(cronJob: DataObject & { info: { data: CronJob } }): number {
    const childJobs: (DataObject & { info: { data: Job } })[] = this.LibNodeHelpers.getChildObjectsByType(cronJob.info.mainUuid, 'kubernetes', 'Job', cronJob.info.obj);

    if (!childJobs.length) return 0;
    return childJobs.filter(job => !this.getCondition(job)).length;

  }

  private getCondition(job: DataObject & { info: { data: Job } }) {
    // Type of Job condition could be only Complete or Failed
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.14/#jobcondition-v1-batch
    const { conditions } = job.info.data.status;
    if (!conditions) return;
    return conditions.find(({ status }) => status === 'True');
  }

  // TODO
  goToElement(k8sObject?: DataObject): void {
    return null;
  }

}
