import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './pages/auth.component';
import { NoAuthGuard } from '../../core/guards/no-auth.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [
    {
        path: 'login',
        component: AuthComponent,
        canActivate: [NoAuthGuard]
    },
    {
        path: 'register',
        component: AuthComponent,
        canActivate: [NoAuthGuard]
    },
    {
        path: 'forgot-password-reset',
        component: ForgotPasswordComponent,
        canActivate: [NoAuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
