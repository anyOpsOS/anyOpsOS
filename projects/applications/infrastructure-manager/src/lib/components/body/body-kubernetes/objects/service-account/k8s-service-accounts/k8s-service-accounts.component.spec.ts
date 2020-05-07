import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sServiceAccountsComponent } from './k8s-service-accounts.component';

describe('K8sServiceAccountsComponent', () => {
  let component: K8sServiceAccountsComponent;
  let fixture: ComponentFixture<K8sServiceAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sServiceAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sServiceAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
