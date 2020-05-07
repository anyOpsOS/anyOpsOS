import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sHorizontalPodAutoscalersComponent } from './k8s-horizontal-pod-autoscalers.component';

describe('K8sHorizontalPodAutoscalersComponent', () => {
  let component: K8sHorizontalPodAutoscalersComponent;
  let fixture: ComponentFixture<K8sHorizontalPodAutoscalersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sHorizontalPodAutoscalersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sHorizontalPodAutoscalersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
