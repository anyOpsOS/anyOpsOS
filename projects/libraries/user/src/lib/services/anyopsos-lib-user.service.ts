import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { UserState } from '../types/user-state';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibUserService {
  private readonly stateSource: BehaviorSubject<UserState> = new BehaviorSubject({
    userLoggedIn: false,
    username: ''
  });

  readonly currentState = this.stateSource.asObservable();

  constructor(private readonly http: HttpClient) {
  }

  setState(data: UserState): void {
    this.stateSource.next(data);
  }

  loginUser(username: string, password: string): Observable<{ [key: string]: any }> {
    return this.http.post('/api/auth', {
      username,
      password
    });
  }

  getSession(): Observable<{ [key: string]: any }> {
    return this.http.get('/api/auth');
  }
}
