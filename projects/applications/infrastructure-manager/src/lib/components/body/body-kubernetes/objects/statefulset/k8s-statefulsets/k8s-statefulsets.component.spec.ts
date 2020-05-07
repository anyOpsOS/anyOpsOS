import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sStatefulsetsComponent } from './k8s-statefulsets.component';

describe('K8sStatefulsetsComponent', () => {
  let component: K8sStatefulsetsComponent;
  let fixture: ComponentFixture<K8sStatefulsetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sStatefulsetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sStatefulsetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
