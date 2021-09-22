import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CustomComponent } from './custom/custom.component';
import { BasicLoginComponent } from './basiclogin/basiclogin.component'
import { MFAWidgetComponent } from './mfawidget/mfawidget.component';
import { FundTransferComponent } from './fundtransfer/fundtransfer.component';
import { Flow1Component } from './flow1/flow1.component';
import { LoginProtocolComponent } from './loginprotocols/loginprotocol.component';
import { ApionlyComponent } from './apionly/apionly.component';
import { Metadata } from './metadata/metadata.component';
import { Flow2Component } from './flow2/flow2.component';
import { OidcFlowComponent } from './oidcflow/oidcflow.component';
import { RedirectComponent } from './redirect/redirect.component';
import { OAuthFlowComponent } from './oauthflow/oauthflow.component';
import { M2MComponent } from './m2m/m2m.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: RegisterComponent },
  { path: 'custom', component: CustomComponent },
  { path: 'basiclogin', component: BasicLoginComponent },
  { path: 'mfawidget', component: MFAWidgetComponent },
  { path: 'fundtransfer', component: FundTransferComponent },
  { path: 'flow1', component: Flow1Component },
  { path: 'loginprotocols', component: LoginProtocolComponent },
  { path: 'apionly', component: ApionlyComponent },
  { path: 'metadata', component: Metadata },
  { path: 'flow2', component: Flow2Component },
  { path: 'oidcflow', component: OidcFlowComponent },
  { path: 'RedirectResource', component: RedirectComponent },
  { path: 'oauthflow', component: OAuthFlowComponent },
  { path: 'm2m', component: M2MComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
