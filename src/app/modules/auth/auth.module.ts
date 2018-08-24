import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './pages/auth.component';
import { NoAuthGuard } from '../../core/guards/no-auth.guard';
import { SharedModule } from '../../shared';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SignupSigninComponent } from './pages/signup-signin/signup-signin.component';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [AuthComponent, ForgotPasswordComponent, SignupSigninComponent],
  exports: [AuthComponent],
  providers: [
    NoAuthGuard
  ]
})
export class AuthModule { }
