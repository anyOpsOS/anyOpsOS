import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyOpsOSModalKubernetesEditResourceComponent } from './anyopsos-modal-kubernetes-edit-resource.component';

describe('AnyOpsOSModalKubernetesEditResourceComponent', () => {
  let component: AnyOpsOSModalKubernetesEditResourceComponent;
  let fixture: ComponentFixture<AnyOpsOSModalKubernetesEditResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnyOpsOSModalKubernetesEditResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnyOpsOSModalKubernetesEditResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
