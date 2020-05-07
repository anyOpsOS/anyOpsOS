import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sClusterPieChartsComponent } from './k8s-cluster-pie-charts.component';

describe('K8sClusterPieChartsComponent', () => {
  let component: K8sClusterPieChartsComponent;
  let fixture: ComponentFixture<K8sClusterPieChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sClusterPieChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sClusterPieChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
