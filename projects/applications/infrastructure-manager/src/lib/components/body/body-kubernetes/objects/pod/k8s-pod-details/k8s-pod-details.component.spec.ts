import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sPodDetailsComponent } from './k8s-pod-details.component';

describe('K8sPodDetailsComponent', () => {
  let component: K8sPodDetailsComponent;
  let fixture: ComponentFixture<K8sPodDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sPodDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sPodDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
