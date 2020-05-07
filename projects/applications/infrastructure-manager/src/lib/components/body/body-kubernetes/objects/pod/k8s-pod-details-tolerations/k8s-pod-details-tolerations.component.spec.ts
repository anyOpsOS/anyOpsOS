import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPodDetailsTolerationsComponent } from './k8s-pod-details-tolerations.component';

describe('K8sPodDetailsTolerationsComponent', () => {
  let component: K8sPodDetailsTolerationsComponent;
  let fixture: ComponentFixture<K8sPodDetailsTolerationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPodDetailsTolerationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPodDetailsTolerationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
