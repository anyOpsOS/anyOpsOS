import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sClusterDetailsComponent } from './k8s-cluster-details.component';

describe('K8sClusterDetailsComponent', () => {
  let component: K8sClusterDetailsComponent;
  let fixture: ComponentFixture<K8sClusterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sClusterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sClusterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
