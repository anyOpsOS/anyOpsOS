import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sNodesComponent } from './k8s-nodes.component';

describe('K8sNodesComponent', () => {
  let component: K8sNodesComponent;
  let fixture: ComponentFixture<K8sNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sNodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
