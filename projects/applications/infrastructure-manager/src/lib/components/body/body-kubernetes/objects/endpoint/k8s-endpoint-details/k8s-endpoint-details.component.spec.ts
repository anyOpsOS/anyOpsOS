import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sEndpointDetailsComponent } from './k8s-endpoint-details.component';

describe('K8sEndpointDetailsComponent', () => {
  let component: K8sEndpointDetailsComponent;
  let fixture: ComponentFixture<K8sEndpointDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sEndpointDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sEndpointDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
