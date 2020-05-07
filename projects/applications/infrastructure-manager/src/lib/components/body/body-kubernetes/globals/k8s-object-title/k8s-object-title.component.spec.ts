import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectTitleComponent } from './k8s-object-title.component';

describe('K8sObjectTitleComponent', () => {
  let component: K8sObjectTitleComponent;
  let fixture: ComponentFixture<K8sObjectTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
