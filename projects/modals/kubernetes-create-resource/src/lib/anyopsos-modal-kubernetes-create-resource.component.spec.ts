import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyOpsOSModalKubernetesCreateResourceComponent } from './anyopsos-modal-kubernetes-create-resource.component';

describe('AnyOpsOSModalKubernetesCreateResourceComponent', () => {
  let component: AnyOpsOSModalKubernetesCreateResourceComponent;
  let fixture: ComponentFixture<AnyOpsOSModalKubernetesCreateResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnyOpsOSModalKubernetesCreateResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnyOpsOSModalKubernetesCreateResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
