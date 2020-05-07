import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sCertificateDetailsComponent } from './k8s-certificate-details.component';

describe('K8sCertificateDetailsComponent', () => {
  let component: K8sCertificateDetailsComponent;
  let fixture: ComponentFixture<K8sCertificateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sCertificateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sCertificateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
