import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sStorageClassesComponent } from './k8s-storage-classes.component';

describe('K8sStorageClassesComponent', () => {
  let component: K8sStorageClassesComponent;
  let fixture: ComponentFixture<K8sStorageClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sStorageClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sStorageClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
