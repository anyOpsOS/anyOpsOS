import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sServiceDetailsComponent } from './k8s-service-details.component';

describe('K8sServiceDetailsComponent', () => {
  let component: K8sServiceDetailsComponent;
  let fixture: ComponentFixture<K8sServiceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sServiceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
