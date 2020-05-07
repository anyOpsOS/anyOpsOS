import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPersistentVolumeClaimDiskChartComponent } from './k8s-persistent-volume-claim-disk-chart.component';

describe('K8sPersistentVolumeClaimDiskChartComponent', () => {
  let component: K8sPersistentVolumeClaimDiskChartComponent;
  let fixture: ComponentFixture<K8sPersistentVolumeClaimDiskChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPersistentVolumeClaimDiskChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPersistentVolumeClaimDiskChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
