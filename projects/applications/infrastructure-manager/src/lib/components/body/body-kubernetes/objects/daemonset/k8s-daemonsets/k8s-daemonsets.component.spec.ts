import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sDaemonsetsComponent } from './k8s-daemonsets.component';

describe('K8sDaemonsetsComponent', () => {
  let component: K8sDaemonsetsComponent;
  let fixture: ComponentFixture<K8sDaemonsetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sDaemonsetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sDaemonsetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
