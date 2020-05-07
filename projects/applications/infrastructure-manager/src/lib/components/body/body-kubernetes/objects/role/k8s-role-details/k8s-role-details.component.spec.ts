import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sRoleDetailsComponent } from './k8s-role-details.component';

describe('K8sRoleDetailsComponent', () => {
  let component: K8sRoleDetailsComponent;
  let fixture: ComponentFixture<K8sRoleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sRoleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sRoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
