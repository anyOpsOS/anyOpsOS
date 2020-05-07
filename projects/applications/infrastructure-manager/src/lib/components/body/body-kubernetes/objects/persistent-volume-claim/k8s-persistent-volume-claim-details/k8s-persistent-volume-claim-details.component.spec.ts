import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPersistentVolumeClaimDetailsComponent } from './k8s-persistent-volume-claim-details.component';

describe('K8sPersistentVolumeClaimDetailsComponent', () => {
  let component: K8sPersistentVolumeClaimDetailsComponent;
  let fixture: ComponentFixture<K8sPersistentVolumeClaimDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPersistentVolumeClaimDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPersistentVolumeClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
