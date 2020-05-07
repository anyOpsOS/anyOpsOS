import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPodDetailsAffinitiesComponent } from './k8s-pod-details-affinities.component';

describe('K8sPodDetailsAffinitiesComponent', () => {
  let component: K8sPodDetailsAffinitiesComponent;
  let fixture: ComponentFixture<K8sPodDetailsAffinitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPodDetailsAffinitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPodDetailsAffinitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
