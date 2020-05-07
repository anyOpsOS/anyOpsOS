import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectEventsComponent } from './k8s-object-events.component';

describe('K8sObjectEventsComponent', () => {
  let component: K8sObjectEventsComponent;
  let fixture: ComponentFixture<K8sObjectEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
