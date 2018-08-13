import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MngUsersComponent } from './pages/mng-users/mng-users.component';
import { UserResolver } from './resolvers/user-resolver.service';
import { Breadcrumb } from '../../core/models';
import { MngEntitesComponent } from './pages/mng-entites/mng-entites.component';
import { MngCategoriesComponent } from './pages/mng-categories/mng-categories.component';
import { CategoryResolver } from './resolvers/category-resolver.service';

const routes: Routes = [{
    path: '',
    component: DashboardComponent
}, {
    path: 'users',
    component: MngUsersComponent,
    data: {
        breadcrumbs: [
            new Breadcrumb('Users', '/admin/users')
        ]
    }
}, {
    path: 'users/:id/edit',
    component: MngUsersComponent,
    resolve: {
        user: UserResolver
    },
    data: {
        breadcrumbs: [
            new Breadcrumb('Users', '/admin/users')
        ]
    }
}, {
    path: 'categories',
    component: MngCategoriesComponent,
    data: {
        breadcrumbs: [
            new Breadcrumb('Categories', '/admin/categories')
        ]
    }
}, {
    path: 'categories/:id/edit',
    component: MngCategoriesComponent,
    resolve: {
        category: CategoryResolver
    },
    data: {
        breadcrumbs: [
            new Breadcrumb('Categories', '/admin/categories')
        ]
    }
}, {
    path: 'entities',
    component: MngEntitesComponent,
    data: {
        breadcrumbs: [
            new Breadcrumb('Entities', 'admin/entities')
        ]
    }
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
