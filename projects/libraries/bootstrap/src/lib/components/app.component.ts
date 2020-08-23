import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {CookieService} from 'ngx-cookie-service';

import {AnyOpsOSLibLoggerService} from '@anyopsos/lib-logger';
import {AnyOpsOSLibUserService} from '@anyopsos/lib-user';
import {AnyOpsOSLibModalService} from '@anyopsos/lib-modal';
import {VaultState} from '@anyopsos/module-vault';
import {BackendResponse} from '@anyopsos/backend-core/app/types/backend-response';

import {AnyOpsOSLibBootstrapService} from '../services/anyopsos-lib-bootstrap.service';

@Component({
  selector: 'albp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userLoggedIn: boolean;
  appBootstrapped: boolean;

  vaultState: VaultState;

  constructor(private readonly http: HttpClient,
              private readonly viewContainerRef: ViewContainerRef,
              private readonly cookieService: CookieService,
              private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibBootstrap: AnyOpsOSLibBootstrapService,
              private readonly LibModal: AnyOpsOSLibModalService,
              private readonly LibUserState: AnyOpsOSLibUserService) {

    this.LibModal.setMainContainerRef(this.viewContainerRef);
  }

  async ngOnInit(): Promise<void> {
    this.logger.info('anyOpsOS', 'Initializing APP');

    // Called once app is bootstrapped
    this.LibBootstrap.currentBootstrapState.subscribe(state => this.appBootstrapped = state.appBootstrapped);

    // Called once User is logged in
    this.LibUserState.currentState.subscribe(state => this.userLoggedIn = state.userLoggedIn);

    await this.getVaultState();

    if (this.vaultState.users === 0 || !this.cookieService.check('uniqueId')) return;

    this.logger.debug('anyOpsOS', 'Getting session');

    this.checkUserSession();

  }

  onStateChanged(): void {
    this.getVaultState();
  }

  private checkUserSession() {

    this.LibUserState.getSession().subscribe(
      (res: BackendResponse) => {
        if (res.status === 'error') {
          this.logger.debug('anyOpsOS', 'checkUserSession -> Removing uniqueId cookie', null);
          return this.cookieService.delete('uniqueId');
        }

        this.logger.info('anyOpsOS', 'checkUserSession -> User logged in', null);
        this.LibUserState.setState({
          userLoggedIn: true,
          username: 'root'
        });

      },
      (error: BackendResponse) => {
        this.logger.debug('anyOpsOS', 'checkUserSession -> Removing uniqueId cookie', null, error);
        return this.cookieService.delete('uniqueId');
      });
  }

  private getVaultState(): Promise<void> {

    return new Promise(async (resolve) => {

      this.http.get('/api/vault').subscribe(
        (res: BackendResponse & { data: VaultState; }) => {
          if (res.status === 'error') this.logger.error('anyOpsOS', 'getVaultState -> Error while getting vault state', null, res.data);

          if (res.status === 'ok') {
            this.vaultState = res.data;
            return resolve();
          }
        },
        (error: BackendResponse) => {
          this.logger.error('anyOpsOS', 'getVaultState -> Error while getting vault state', null, error);
        });

    });
  }
}
