import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sResourceQuotaDetailsComponent } from './k8s-resource-quota-details.component';

describe('K8sResourceQuotaDetailsComponent', () => {
  let component: K8sResourceQuotaDetailsComponent;
  let fixture: ComponentFixture<K8sResourceQuotaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sResourceQuotaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sResourceQuotaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
