import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sRoleBindingDetailsComponent } from './k8s-role-binding-details.component';

describe('K8sRoleBindingDetailsComponent', () => {
  let component: K8sRoleBindingDetailsComponent;
  let fixture: ComponentFixture<K8sRoleBindingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sRoleBindingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sRoleBindingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
