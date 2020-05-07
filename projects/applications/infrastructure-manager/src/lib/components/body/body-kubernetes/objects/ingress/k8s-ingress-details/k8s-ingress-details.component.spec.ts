import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sIngressDetailsComponent } from './k8s-ingress-details.component';

describe('K8sIngressDetailsComponent', () => {
  let component: K8sIngressDetailsComponent;
  let fixture: ComponentFixture<K8sIngressDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sIngressDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sIngressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
