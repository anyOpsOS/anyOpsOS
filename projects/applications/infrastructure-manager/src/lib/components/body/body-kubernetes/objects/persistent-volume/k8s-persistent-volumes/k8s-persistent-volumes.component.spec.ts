import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPersistentVolumesComponent } from './k8s-persistent-volumes.component';

describe('K8sPersistentVolumesComponent', () => {
  let component: K8sPersistentVolumesComponent;
  let fixture: ComponentFixture<K8sPersistentVolumesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPersistentVolumesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPersistentVolumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
