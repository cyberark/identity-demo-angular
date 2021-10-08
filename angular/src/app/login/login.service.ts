/*
* Copyright (c) 2021 CyberArk Software Ltd. All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {  EndpointsConnector } from '../EndpointsConnector';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) { }

  beginAuth(User: string) {
    let head = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Methods', 'POST')
      .set('Access-Control-Allow-Origin', '*')
      ;

    return this.http.post<any>(EndpointsConnector.BeginAuthEndPoint, { User, Version: "1.0" }, { headers: head })
      .pipe(map(user => {
        return user;
      }));
  }

  advanceAuth(SessionId: string, TenantId: string, MechanismId: string, Action: string, Answer: string) {
    let head = new HttpHeaders().set('Content-Type', 'application/json');

    if (!MechanismId || MechanismId == "") {
      return this.http.post<any>(EndpointsConnector.AdvanceAuthEndPoint, { SessionId, TenantId, Action: "ForgotPassword" }, { headers: head, withCredentials: true, })
        .pipe(map(user => {
          return user;
        }));
    } else if (!Answer || Answer == "") {
      return this.http.post<any>(EndpointsConnector.AdvanceAuthEndPoint, { SessionId, TenantId, MechanismId, Action }, { headers: head, withCredentials: true, })
        .pipe(map(user => {
          return user;
        }));
    }
    return this.http.post<any>(EndpointsConnector.AdvanceAuthEndPoint, { SessionId, TenantId, MechanismId, Action: "Answer", Answer }, { headers: head, withCredentials: true, }) /*observe: 'response' */
      .pipe(map(user => {
        return user;
      }));
  }

  getPollingChallenge(SessionId: string, TenantId: string, MechanismId: string) {
    let head = new HttpHeaders().set('Content-Type', 'application/json');
    return interval(5000).pipe(switchMap(() => this.http.post<any>(EndpointsConnector.AdvanceAuthEndPoint, { SessionId, TenantId, MechanismId, Action: "Poll" }, { headers: head, withCredentials: true, })
      .pipe(map(user => {
        return user;
      }))));
  }

  logout() {
    let head = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(EndpointsConnector.LogOutEndPoint, {}, { headers: head, withCredentials: true, })
      .pipe(map(user => {
        return user;
      }));
  }
}
