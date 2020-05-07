import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectBadgeComponent } from './k8s-object-badge.component';

describe('K8sObjectBadgeComponent', () => {
  let component: K8sObjectBadgeComponent;
  let fixture: ComponentFixture<K8sObjectBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
