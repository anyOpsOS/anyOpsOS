import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sClusterIssuesComponent } from './k8s-cluster-issues.component';

describe('K8sClusterIssuesComponent', () => {
  let component: K8sClusterIssuesComponent;
  let fixture: ComponentFixture<K8sClusterIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sClusterIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sClusterIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
