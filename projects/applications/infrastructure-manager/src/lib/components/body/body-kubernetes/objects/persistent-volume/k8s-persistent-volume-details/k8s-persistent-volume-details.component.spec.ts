import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPersistentVolumeDetailsComponent } from './k8s-persistent-volume-details.component';

describe('K8sPersistentVolumeDetailsComponent', () => {
  let component: K8sPersistentVolumeDetailsComponent;
  let fixture: ComponentFixture<K8sPersistentVolumeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPersistentVolumeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPersistentVolumeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
