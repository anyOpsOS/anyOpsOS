import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sStorageClassDetailsComponent } from './k8s-storage-class-details.component';

describe('K8sStorageClassDetailsComponent', () => {
  let component: K8sStorageClassDetailsComponent;
  let fixture: ComponentFixture<K8sStorageClassDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sStorageClassDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sStorageClassDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
