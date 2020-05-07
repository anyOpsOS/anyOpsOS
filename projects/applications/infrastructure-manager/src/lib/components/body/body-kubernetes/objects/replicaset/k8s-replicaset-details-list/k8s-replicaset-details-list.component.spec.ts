import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sReplicasetDetailsListComponent } from './k8s-replicaset-details-list.component';

describe('K8sReplicasetDetailsListComponent', () => {
  let component: K8sReplicasetDetailsListComponent;
  let fixture: ComponentFixture<K8sReplicasetDetailsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sReplicasetDetailsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sReplicasetDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
