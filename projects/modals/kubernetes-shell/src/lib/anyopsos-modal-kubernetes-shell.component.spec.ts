import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyOpsOSModalKubernetesShellComponent } from './anyopsos-modal-kubernetes-shell.component';

describe('AnyOpsOSModalKubernetesShellComponent', () => {
  let component: AnyOpsOSModalKubernetesShellComponent;
  let fixture: ComponentFixture<AnyOpsOSModalKubernetesShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnyOpsOSModalKubernetesShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnyOpsOSModalKubernetesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
