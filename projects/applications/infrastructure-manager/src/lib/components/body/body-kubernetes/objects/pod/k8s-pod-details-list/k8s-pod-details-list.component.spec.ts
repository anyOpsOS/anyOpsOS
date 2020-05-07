import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPodDetailsListComponent } from './k8s-pod-details-list.component';

describe('K8sPodDetailsListComponent', () => {
  let component: K8sPodDetailsListComponent;
  let fixture: ComponentFixture<K8sPodDetailsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPodDetailsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPodDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
