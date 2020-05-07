import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sNodeDetailsComponent } from './k8s-node-details.component';

describe('K8sNodeDetailsComponent', () => {
  let component: K8sNodeDetailsComponent;
  let fixture: ComponentFixture<K8sNodeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sNodeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sNodeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
