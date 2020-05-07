import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sCronJobDetailsComponent } from './k8s-cronjob-details.component';

describe('K8sCronJobDetailsComponent', () => {
  let component: K8sCronJobDetailsComponent;
  let fixture: ComponentFixture<K8sCronJobDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sCronJobDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sCronJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
