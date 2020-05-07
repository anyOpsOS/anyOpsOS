import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sRolesComponent } from './k8s-roles.component';

describe('K8sRolesComponent', () => {
  let component: K8sRolesComponent;
  let fixture: ComponentFixture<K8sRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
