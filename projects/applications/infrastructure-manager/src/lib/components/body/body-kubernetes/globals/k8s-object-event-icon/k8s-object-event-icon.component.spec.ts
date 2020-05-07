import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectEventIconComponent } from './k8s-object-event-icon.component';

describe('K8sObjectEventIconComponent', () => {
  let component: K8sObjectEventIconComponent;
  let fixture: ComponentFixture<K8sObjectEventIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectEventIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectEventIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
