import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectItemLabelsComponent } from './k8s-object-item-labels.component';

describe('K8sObjectItemLabelsComponent', () => {
  let component: K8sObjectItemLabelsComponent;
  let fixture: ComponentFixture<K8sObjectItemLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectItemLabelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectItemLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
