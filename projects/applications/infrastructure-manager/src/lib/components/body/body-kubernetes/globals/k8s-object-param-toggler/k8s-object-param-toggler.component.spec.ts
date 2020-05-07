import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectParamTogglerComponent } from './k8s-object-param-toggler.component';

describe('K8sObjectParamTogglerComponent', () => {
  let component: K8sObjectParamTogglerComponent;
  let fixture: ComponentFixture<K8sObjectParamTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectParamTogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectParamTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
