import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sNamespacesComponent } from './k8s-namespaces.component';

describe('K8sNamespacesComponent', () => {
  let component: K8sNamespacesComponent;
  let fixture: ComponentFixture<K8sNamespacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sNamespacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sNamespacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
