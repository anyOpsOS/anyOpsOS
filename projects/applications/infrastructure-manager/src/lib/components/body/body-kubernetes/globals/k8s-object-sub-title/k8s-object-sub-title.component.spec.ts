import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectSubTitleComponent } from './k8s-object-sub-title.component';

describe('K8sObjectSubTitleComponent', () => {
  let component: K8sObjectSubTitleComponent;
  let fixture: ComponentFixture<K8sObjectSubTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectSubTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectSubTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
