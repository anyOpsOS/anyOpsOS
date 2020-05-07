import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sStatefulsetDetailsComponent } from './k8s-statefulset-details.component';

describe('K8sStatefulsetDetailsComponent', () => {
  let component: K8sStatefulsetDetailsComponent;
  let fixture: ComponentFixture<K8sStatefulsetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sStatefulsetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sStatefulsetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
