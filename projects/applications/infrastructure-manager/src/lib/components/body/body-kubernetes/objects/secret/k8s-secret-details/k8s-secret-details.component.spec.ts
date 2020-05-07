import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sSecretDetailsComponent } from './k8s-secret-details.component';

describe('K8sSecretDetailsComponent', () => {
  let component: K8sSecretDetailsComponent;
  let fixture: ComponentFixture<K8sSecretDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sSecretDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sSecretDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
