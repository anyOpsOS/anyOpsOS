import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sNetworkPoliciesComponent } from './k8s-network-policies.component';

describe('K8sNetworkPoliciesComponent', () => {
  let component: K8sNetworkPoliciesComponent;
  let fixture: ComponentFixture<K8sNetworkPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sNetworkPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sNetworkPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
