import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sServicesComponent } from './k8s-services.component';

describe('K8sServicesComponent', () => {
  let component: K8sServicesComponent;
  let fixture: ComponentFixture<K8sServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
