import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sConfigMapDetailsComponent } from './k8s-config-map-details.component';

describe('K8sConfigMapDetailsComponent', () => {
  let component: K8sConfigMapDetailsComponent;
  let fixture: ComponentFixture<K8sConfigMapDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sConfigMapDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sConfigMapDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
