import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPodSecurityPolicyDetailsComponent } from './k8s-pod-security-policy-details.component';

describe('K8sPodSecurityPolicyDetailsComponent', () => {
  let component: K8sPodSecurityPolicyDetailsComponent;
  let fixture: ComponentFixture<K8sPodSecurityPolicyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPodSecurityPolicyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPodSecurityPolicyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
