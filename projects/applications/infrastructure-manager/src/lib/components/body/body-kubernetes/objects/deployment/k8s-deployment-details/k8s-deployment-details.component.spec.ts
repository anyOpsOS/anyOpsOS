import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sDeploymentDetailsComponent } from './k8s-deployment-details.component';

describe('K8sDeploymentDetailsComponent', () => {
  let component: K8sDeploymentDetailsComponent;
  let fixture: ComponentFixture<K8sDeploymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sDeploymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sDeploymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
