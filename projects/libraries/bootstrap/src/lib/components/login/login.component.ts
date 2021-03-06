import { Component, OnDestroy } from '@angular/core';

import { AnyOpsOSLibLoggerService } from '@anyopsos/lib-logger';
import { AnyOpsOSLibUserService } from '@anyopsos/lib-user';

import { BackendResponse } from '@anyopsos/backend-core/app/types/backend-response';

@Component({
  selector: 'albp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  username: string = 'root';
  password: string;
  capsOn: boolean = false;
  invalidLogin: boolean = false;

  date: string;
  time: string;

  private timeInterval: NodeJS.Timeout = setInterval(
    () => {
      this.date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      this.time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    },
    1000);

  constructor(private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibUserState: AnyOpsOSLibUserService) {

  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
  }

  login(username: string, password: string): void {

    this.LibUserState.loginUser(username, password).subscribe(
      (res: BackendResponse) => {
        if (res.status === 'error') {
          this.invalidLogin = res.data;
          this.logger.error('anyOpsOS', 'login -> Error while login user', null, res.data);
        }

        this.logger.info('anyOpsOS', 'login -> User logged in', null);
        this.LibUserState.setState({
          userLoggedIn: true,
          username: this.username
        });

      },
      error => {
        this.logger.error('anyOpsOS', 'login -> Error while login user', null, error);
      });
  }

  getDate(): string {
    return this.date;
  }

  getTime(): string {
    return this.time;
  }

}
