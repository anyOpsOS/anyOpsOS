import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sIngressDetailsChartsComponent } from './k8s-ingress-details-charts.component';

describe('K8sIngressDetailsChartsComponent', () => {
  let component: K8sIngressDetailsChartsComponent;
  let fixture: ComponentFixture<K8sIngressDetailsChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sIngressDetailsChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sIngressDetailsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
