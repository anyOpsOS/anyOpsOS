import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyOpsOSModalKubernetesLogsComponent } from './anyopsos-modal-kubernetes-logs.component';

describe('AnyOpsOSModalKubernetesLogsComponent', () => {
  let component: AnyOpsOSModalKubernetesLogsComponent;
  let fixture: ComponentFixture<AnyOpsOSModalKubernetesLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnyOpsOSModalKubernetesLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnyOpsOSModalKubernetesLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
