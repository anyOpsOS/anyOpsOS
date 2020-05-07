import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectItemComponent } from './k8s-object-item.component';

describe('K8sObjectItemComponent', () => {
  let component: K8sObjectItemComponent;
  let fixture: ComponentFixture<K8sObjectItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
