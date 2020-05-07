import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPersistentVolumeClaimsComponent } from './k8s-persistent-volume-claims.component';

describe('K8sPersistentVolumeClaimsComponent', () => {
  let component: K8sPersistentVolumeClaimsComponent;
  let fixture: ComponentFixture<K8sPersistentVolumeClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPersistentVolumeClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPersistentVolumeClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
