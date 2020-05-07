import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sEndpointSubsetListComponent } from './k8s-endpoint-subset-list.component';

describe('K8sEndpointSubsetListComponent', () => {
  let component: K8sEndpointSubsetListComponent;
  let fixture: ComponentFixture<K8sEndpointSubsetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K8sEndpointSubsetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sEndpointSubsetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
