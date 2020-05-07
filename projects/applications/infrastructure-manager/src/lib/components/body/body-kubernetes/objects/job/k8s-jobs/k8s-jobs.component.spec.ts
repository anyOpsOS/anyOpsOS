import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sJobsComponent } from './k8s-jobs.component';

describe('K8sJobsComponent', () => {
  let component: K8sJobsComponent;
  let fixture: ComponentFixture<K8sJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
