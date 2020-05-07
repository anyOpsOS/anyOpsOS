import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sDeploymentsComponent } from './k8s-deployments.component';

describe('K8sDeploymentsComponent', () => {
  let component: K8sDeploymentsComponent;
  let fixture: ComponentFixture<K8sDeploymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sDeploymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sDeploymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
