import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './core';
import { AdminGuard } from './core/guards/admin.guard';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: './modules/home/home.module#HomeModule'
    },
    {
        path: 'category',
        loadChildren: './modules/category/category.module#CategoryModule'
    },
    {
        path: 'entity',
        loadChildren: './modules/entity/entity.module#EntityModule'
    },
    {
        path: 'user',
        loadChildren: './modules/user/user.module#UserModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        loadChildren: './modules/admin/admin.module#AdminModule',
        canActivate: [AdminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
