import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


const routes: Routes = [
    {
        path: 'auth',
        loadChildren: './modules/auth/auth.module#AuthModule',
    },
    {
        path: '',
        loadChildren: './modules/template/template.module#TemplateModule'
    },
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
