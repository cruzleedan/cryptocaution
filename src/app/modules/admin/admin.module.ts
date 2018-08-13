import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from '../../shared';
import { DashboardWidgetsModule } from './dashboard-widgets/dashboard-widgets.module';
import { UsersTblComponent } from './pages/mng-users/components/users-tbl/users-tbl.component';
import { MngUsersComponent } from './pages/mng-users/mng-users.component';
import { UserResolver } from './resolvers/user-resolver.service';
import { UserFormComponent } from './pages/mng-users/components/user-form/user-form.component';
import { MngEntitesComponent } from './pages/mng-entites/mng-entites.component';
import { MngCategoriesComponent } from './pages/mng-categories/mng-categories.component';
import { CategoriesTblComponent } from './pages/mng-categories/components/categories-tbl/categories-tbl.component';
import { CategoriesFormComponent } from './pages/mng-categories/components/categories-form/categories-form.component';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    DashboardWidgetsModule
  ],
  providers: [UserResolver],
  declarations: [DashboardComponent, UsersTblComponent, MngUsersComponent, UserFormComponent, MngEntitesComponent, MngCategoriesComponent, CategoriesTblComponent, CategoriesFormComponent]
})
export class AdminModule { }
