import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AnyOpsOSLibUserService } from '@anyopsos/lib-user';
import { AnyOpsOSLibFileSystemUiService } from '@anyopsos/lib-file-system-ui';
import { Application } from '@anyopsos/lib-application';

@Component({
  selector: 'aafe-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit, OnDestroy {
  @Input() readonly application: Application;

  private readonly destroySubject$: Subject<void> = new Subject();

  username: string;

  constructor(private readonly UserState: AnyOpsOSLibUserService,
              private readonly LibFileSystemUi: AnyOpsOSLibFileSystemUiService) {
  }

  ngOnInit(): void {

    // Get the current logged in username
    this.UserState.currentState
      .pipe(takeUntil(this.destroySubject$)).subscribe(state => this.username = state.username);
  }

  ngOnDestroy(): void {

    // Remove all listeners
    this.destroySubject$.next();
  }

  goToPath(path: string): void {
    this.LibFileSystemUi.sendGoToPath({
      application: 'file-explorer#local',
      path
    });
  }

  /**
   * Left sidebar
   */
  toggleList($event): void {
    $event.currentTarget.parentElement.parentElement.classList.toggle('side__list--open');
  }
}
