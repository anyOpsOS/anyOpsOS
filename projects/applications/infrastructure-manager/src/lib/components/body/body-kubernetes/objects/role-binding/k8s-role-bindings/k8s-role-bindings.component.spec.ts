import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sRoleBindingsComponent } from './k8s-role-bindings.component';

describe('K8sRoleBindingsComponent', () => {
  let component: K8sRoleBindingsComponent;
  let fixture: ComponentFixture<K8sRoleBindingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sRoleBindingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sRoleBindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
