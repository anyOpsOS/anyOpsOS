import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sNetworkPolicyDetailsComponent } from './k8s-network-policy-details.component';

describe('K8sNetworkPolicyDetailsComponent', () => {
  let component: K8sNetworkPolicyDetailsComponent;
  let fixture: ComponentFixture<K8sNetworkPolicyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sNetworkPolicyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sNetworkPolicyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
