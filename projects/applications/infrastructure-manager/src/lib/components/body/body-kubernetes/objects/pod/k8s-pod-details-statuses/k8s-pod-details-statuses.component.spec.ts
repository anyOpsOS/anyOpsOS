import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPodDetailsStatusesComponent } from './k8s-pod-details-statuses.component';

describe('K8sPodDetailsStatusesComponent', () => {
  let component: K8sPodDetailsStatusesComponent;
  let fixture: ComponentFixture<K8sPodDetailsStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPodDetailsStatusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPodDetailsStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
