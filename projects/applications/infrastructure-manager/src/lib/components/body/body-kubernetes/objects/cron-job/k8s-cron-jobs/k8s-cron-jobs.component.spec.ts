import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sCronJobsComponent } from './k8s-cron-jobs.component';

describe('K8sCronJobsComponent', () => {
  let component: K8sCronJobsComponent;
  let fixture: ComponentFixture<K8sCronJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sCronJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sCronJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
