import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sDaemonsetDetailsComponent } from './k8s-daemonset-details.component';

describe('K8sDaemonsetDetailsComponent', () => {
  let component: K8sDaemonsetDetailsComponent;
  let fixture: ComponentFixture<K8sDaemonsetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sDaemonsetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sDaemonsetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
