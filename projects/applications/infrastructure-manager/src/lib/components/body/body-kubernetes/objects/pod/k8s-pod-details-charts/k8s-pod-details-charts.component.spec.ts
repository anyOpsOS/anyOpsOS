import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPodDetailsChartsComponent } from './k8s-pod-details-charts.component';

describe('K8sPodDetailsChartsComponent', () => {
  let component: K8sPodDetailsChartsComponent;
  let fixture: ComponentFixture<K8sPodDetailsChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPodDetailsChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPodDetailsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
