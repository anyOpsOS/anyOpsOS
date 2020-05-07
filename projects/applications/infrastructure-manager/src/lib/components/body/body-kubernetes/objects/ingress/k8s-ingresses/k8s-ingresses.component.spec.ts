import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sIngressesComponent } from './k8s-ingresses.component';

describe('K8sIngressesComponent', () => {
  let component: K8sIngressesComponent;
  let fixture: ComponentFixture<K8sIngressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sIngressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sIngressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
