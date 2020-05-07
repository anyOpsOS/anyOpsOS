import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sHorizontalPodAutoscalerDetailsComponent } from './k8s-horizontal-pod-autoscaler-details.component';

describe('K8sHorizontalPodAutoscalerDetailsComponent', () => {
  let component: K8sHorizontalPodAutoscalerDetailsComponent;
  let fixture: ComponentFixture<K8sHorizontalPodAutoscalerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sHorizontalPodAutoscalerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sHorizontalPodAutoscalerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
