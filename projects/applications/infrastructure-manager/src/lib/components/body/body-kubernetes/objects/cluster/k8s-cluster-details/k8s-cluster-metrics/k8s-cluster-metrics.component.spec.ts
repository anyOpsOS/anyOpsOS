import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sClusterMetricsComponent } from './k8s-cluster-metrics.component';

describe('K8sClusterMetricsComponent', () => {
  let component: K8sClusterMetricsComponent;
  let fixture: ComponentFixture<K8sClusterMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sClusterMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sClusterMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
