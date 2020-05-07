import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sNodeDetailsChartsComponent } from './k8s-node-details-charts.component';

describe('K8sNodeDetailsChartsComponent', () => {
  let component: K8sNodeDetailsChartsComponent;
  let fixture: ComponentFixture<K8sNodeDetailsChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sNodeDetailsChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sNodeDetailsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
