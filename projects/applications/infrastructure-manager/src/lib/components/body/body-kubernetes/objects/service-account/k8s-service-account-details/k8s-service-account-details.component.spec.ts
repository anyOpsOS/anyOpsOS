import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sServiceAccountDetailsComponent } from './k8s-service-account-details.component';

describe('K8sServiceAccountDetailsComponent', () => {
  let component: K8sServiceAccountDetailsComponent;
  let fixture: ComponentFixture<K8sServiceAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sServiceAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sServiceAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
