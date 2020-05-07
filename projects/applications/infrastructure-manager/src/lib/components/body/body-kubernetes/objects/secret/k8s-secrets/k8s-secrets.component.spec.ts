import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sSecretsComponent } from './k8s-secrets.component';

describe('K8sSecretsComponent', () => {
  let component: K8sSecretsComponent;
  let fixture: ComponentFixture<K8sSecretsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sSecretsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sSecretsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
