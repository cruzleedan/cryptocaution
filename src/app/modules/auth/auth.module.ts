import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './pages/auth.component';
import { NoAuthGuard } from '../../core/guards/no-auth.guard';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [AuthComponent],
  providers: [
    NoAuthGuard
  ]
})
export class AuthModule { }
