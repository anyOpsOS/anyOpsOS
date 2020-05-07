import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sResourceQuotasComponent } from './k8s-resource-quotas.component';

describe('K8sResourceQuotasComponent', () => {
  let component: K8sResourceQuotasComponent;
  let fixture: ComponentFixture<K8sResourceQuotasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sResourceQuotasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sResourceQuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
