import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyOpsOSModalKubernetesScaleResourceComponent } from './anyopsos-modal-kubernetes-scale-resource.component';

describe('AnyOpsOSModalKubernetesScaleResourceComponent', () => {
  let component: AnyOpsOSModalKubernetesScaleResourceComponent;
  let fixture: ComponentFixture<AnyOpsOSModalKubernetesScaleResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnyOpsOSModalKubernetesScaleResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnyOpsOSModalKubernetesScaleResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
