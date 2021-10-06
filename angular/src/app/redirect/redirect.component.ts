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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../metadata/authorizationservice';
import { AuthorizationFlow, defaultErrStr, getStorage, OAuthFlow, tokenEndpointBody, TokenMetadataRequest } from '../utils';

@Component({
    selector: 'redirect',
    templateUrl: './redirect.component.html',
})
export class RedirectComponent implements OnInit {

    loading = false;
    authResponse = {};
    isTokenReqVisible = false;
    tokenPostCall = '';
    tokenPostCallBody = '';
    tokenReq = new TokenMetadataRequest();
    errorBody = defaultErrStr;

    constructor(
        private router: Router,
        private authorizationService: AuthorizationService
    ) { }

    ngOnInit() {
        if(this.checkError()){            
            this.errorBody = new URL(window.location.href).searchParams.get("error_description");
            (<any>$('#errorPopup')).modal();
            return;
        }
        if (window.location.hash.length > 0) {
            this.authResponse = this.parseParms(window.location.hash.substring(1));
            if (Object.keys(this.authResponse).includes('code')) this.tokenEndpointPreview();
        } else {
            //Auth code flow
            this.loading = true;
            this.authResponse = this.parseParms(window.location.search.substring(1));
            this.tokenEndpointPreview();
        }
    }

    checkError(){
        return window.location.href.includes('error');
    }

    private tokenEndpointPreview() {
        this.isTokenReqVisible = true;
        const oauth_flow = getStorage('oauthflow_flow');
        const authFlow = getStorage('authFlow');

        this.tokenReq.authorizationCode = this.authResponse['code'];
        if (oauth_flow && oauth_flow === OAuthFlow.authPKCE || authFlow === AuthorizationFlow.OIDC) this.tokenReq.codeVerifier = getStorage('codeVerifier');
        else this.tokenReq.clientSecret = getStorage('client_secret');
        this.tokenReq.authFlow = AuthorizationFlow[authFlow];
        this.tokenReq.clientId = getStorage('username');
        this.authorizationService.getTokenRequestPreview(this.tokenReq).subscribe({
            next: (data) => {
                this.loading = false;
                this.tokenPostCall = data.Result.apiEndPoint;
                this.tokenPostCallBody = tokenEndpointBody(data.Result.payload);
            },
            error: () => {
                this.loading = false;
                (<any>$('#errorPopup')).modal();
            }
        });
    }

    onProceed() {
        this.router.navigateByUrl('/metadata', { state: { authResponse: this.authResponse, tokenReq: this.tokenReq } });
    }

    goBack() {
        if (getStorage('authFlow') === AuthorizationFlow.OAUTH) {
            this.router.navigate(['oauthflow']);
        } else {
            this.router.navigate(['oidcflow']);
        }
    }

    // Parses the URL parameters and returns an object
    parseParms(str: string) {
        let pieces = str.split("&"), data = {}, i, parts;
        // process each query pair
        for (i = 0; i < pieces.length; i++) {
            parts = pieces[i].split("=");
            if (parts.length < 2) {
                parts.push("");
            }
            data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        }
        return data;
    }

    dataKeys(obj: Object) {
        return Object.keys(obj);
    }
}
