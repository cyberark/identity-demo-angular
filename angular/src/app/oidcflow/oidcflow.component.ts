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

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OIDCService } from '../api&oidc/oidc.service';

enum OidcFlow {
  auth = "auth",
  implicit = "implicit",
  hybrid = "hybrid"
}

@Component({
  selector: 'oidcflow',
  templateUrl: './oidcflow.component.html',
  styleUrls: ['./oidcflow.component.css'],
})

export class OidcFlowComponent implements OnInit {
  @ViewChild('authorizeBtn') authorizeBtn;

  oidcFlow: OidcFlow = OidcFlow.auth;
  responseTypes = ["code"];
  authURL = "Authorize URL";
  loading = false;
  codeChallenge = "";
  codeVerifier = "";
  tokenSet = {};
  isIdTokenChecked = false;
  isIdTokenDisabled = false;
  isTokenChecked = false;

  constructor(
    private router: Router,
    private oidcService: OIDCService
  ) { }

  ngOnInit() {
  }

  onBuildAuthUrl() {
    this.loading = true;
    if (this.oidcFlow === OidcFlow.implicit) {
      this.oidcService.buildImplicitAuthURL(this.responseTypes.join(' ')).subscribe(
        data => {
          this.loading = false;
          this.authURL = data.Result.authorizeUrl;
          this.authorizeBtn.nativeElement.disabled = false;
        },
        error => {
          console.error(error);
          this.loading = false;
        }
      )
    } else {
      this.oidcService.getPKCEMetadata().subscribe(
        pkceMetadata => {
          this.codeChallenge = pkceMetadata.Result.codeChallenge;
          this.codeVerifier = pkceMetadata.Result.codeVerifier;
          localStorage.setItem('codeVerifier', this.codeVerifier);
          this.oidcService.buildAuthorizeURL(pkceMetadata.Result.codeChallenge, this.responseTypes.join(' ')).subscribe(
            data => {
              this.loading = false;
              this.authURL = data.Result.authorizeUrl;
              this.authorizeBtn.nativeElement.disabled = false;
            },
            error => {
              console.error(error);
              this.loading = false;
            }
          )
        });
    }
  }

  onBack() {
    this.router.navigate(['loginprotocols']);
  }

  onAccept() {
    this.loading = true;
    window.location.href = this.authURL + "&AUTH=" + this.oidcService.readCookie("AUTH");
  }

  onSelect(val) {
    this.oidcFlow = val;
    if (this.oidcFlow === OidcFlow.auth) {
      this.responseTypes = ["code"];
    } else if (this.oidcFlow === OidcFlow.hybrid) {
      this.isIdTokenChecked = false;
      this.isIdTokenDisabled = false;
      this.isTokenChecked = false;

      this.responseTypes = ["code"];
    } else {
      this.isIdTokenChecked = true;
      this.isIdTokenDisabled = true;
      this.isTokenChecked = false;

      this.responseTypes = ["id_token"];
    }
  }

  onCheckIdToken(isChecked) {
    this.isIdTokenChecked = isChecked;
    if (isChecked && !this.responseTypes.includes("id_token")) this.responseTypes.push("id_token");
    else this.responseTypes = this.responseTypes.filter(t => t !== "id_token");
  }

  onCheckToken(isChecked) {
    this.isTokenChecked = isChecked;
    if (isChecked && !this.responseTypes.includes("token")) this.responseTypes.push("token");
    else this.responseTypes = this.responseTypes.filter(t => t !== "token");
  }
}