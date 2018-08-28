import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './pages/auth.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SignupSigninComponent } from './pages/signup-signin/signup-signin.component';
import { NoAuthGuard } from '../../core/guards/no-auth.guard';

const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        canActivate: [NoAuthGuard],
        children: [
            {
                path: 'login',
                component: SignupSigninComponent
            },
            {
                path: 'register',
                component: SignupSigninComponent
            },
            {
                path: 'forgot-password-reset',
                component: ForgotPasswordComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
