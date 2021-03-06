import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: './modules/template/template.module#TemplateModule'
    },
    {
        path: 'auth',
        loadChildren: './modules/auth/auth.module#AuthModule',
        canActivate: [NoAuthGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
