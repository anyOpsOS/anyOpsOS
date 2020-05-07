import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sConfigMapsComponent } from './k8s-config-maps.component';

describe('K8sConfigMapsComponent', () => {
  let component: K8sConfigMapsComponent;
  let fixture: ComponentFixture<K8sConfigMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sConfigMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sConfigMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
