import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sNamespaceDetailsComponent } from './k8s-namespace-details.component';

describe('K8sNamespaceDetailsComponent', () => {
  let component: K8sNamespaceDetailsComponent;
  let fixture: ComponentFixture<K8sNamespaceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sNamespaceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sNamespaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
