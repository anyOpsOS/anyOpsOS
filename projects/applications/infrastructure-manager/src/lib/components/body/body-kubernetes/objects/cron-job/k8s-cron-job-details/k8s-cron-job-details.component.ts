import {Component, OnInit, Input} from '@angular/core';

import {AnyOpsOSLibNodeHelpersService} from '@anyopsos/lib-node';

import {DataObject} from '@anyopsos/backend-core/app/types/data-object';
import {CronJob} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/cron-job';
import {Job} from '@anyopsos/module-node-kubernetes/src/lib/types/objects/job';

@Component({
  selector: 'aaim-k8s-cron-job-details',
  templateUrl: './k8s-cron-job-details.component.html',
  styleUrls: ['./k8s-cron-job-details.component.scss']
})
export class K8sCronJobDetailsComponent implements OnInit {
  @Input() readonly k8sObject: DataObject & { info: { data: CronJob } };

  isLoaded: boolean = false;
  childJobs: (DataObject & { info: { data: Job } })[] = this.LibNodeHelpers.getChildObjectsByType(this.k8sObject.info.mainUuid, 'kubernetes', 'Job', this.k8sObject.info.obj);

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) { }

  ngOnInit(): void {
    // TODO
    this.isLoaded = true;
  }

  isNeverRun(): boolean {
    const schedule = this.k8sObject.info.data.spec.schedule;
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const stamps = schedule.split(' ');
    const day = Number(stamps[stamps.length - 3]);  // 1-31
    const month = Number(stamps[stamps.length - 2]);  // 1-12
    if (schedule.startsWith('@')) return false;
    return day > daysInMonth[month - 1];
  }

  // Active jobs are jobs without any condition 'Complete' nor 'Failed'
  getActiveJobsNum(): number {
    if (!this.childJobs.length) return 0;
    return this.childJobs.filter(job => !this.getCondition(job)).length;

  }

  getCondition(job: DataObject & { info: { data: Job } }) {
    // Type of Job condition could be only Complete or Failed
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.14/#jobcondition-v1-batch
    const { conditions } = job.info.data.status;
    if (!conditions) return;
    return conditions.find(({ status }) => status === 'True');
  }

}
