import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectResourceMetricsTextComponent } from './k8s-object-resource-metrics-text.component';

describe('K8sObjectResourceMetricsTextComponent', () => {
  let component: K8sObjectResourceMetricsTextComponent;
  let fixture: ComponentFixture<K8sObjectResourceMetricsTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectResourceMetricsTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectResourceMetricsTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
