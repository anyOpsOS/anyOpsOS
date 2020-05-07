import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectResourceMetricsComponent } from './k8s-object-resource-metrics.component';

describe('K8sObjectResourceMetricsComponent', () => {
  let component: K8sObjectResourceMetricsComponent;
  let fixture: ComponentFixture<K8sObjectResourceMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectResourceMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectResourceMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
