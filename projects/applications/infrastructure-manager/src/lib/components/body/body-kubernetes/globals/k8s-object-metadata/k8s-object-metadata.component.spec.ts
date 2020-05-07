import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sObjectMetadataComponent } from './k8s-object-metadata.component';

describe('K8sObjectMetadataComponent', () => {
  let component: K8sObjectMetadataComponent;
  let fixture: ComponentFixture<K8sObjectMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sObjectMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sObjectMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
