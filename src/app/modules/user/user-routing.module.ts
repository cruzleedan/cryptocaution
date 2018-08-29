import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { CanDeactivateGuard } from '../../core/guards/can-deactivate/can-deactivate.guard';
import { EntitiesComponent } from './pages/entities/entities.component';
import { AuthGuard } from '../../core';
import { UserResolver } from '../admin/resolvers/user-resolver.service';

const routes: Routes = [
    {
        path: 'settings',
        component: SettingsComponent,
        canDeactivate: [CanDeactivateGuard],
        canActivate: [AuthGuard]
    },
    {
        path: 'reviews',
        component: ReviewsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'reviews/:id',
        component: ReviewsComponent,
        resolve: {
            user: UserResolver
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'entities',
        component: EntitiesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'entities/:id',
        component: EntitiesComponent,
        resolve: {
            user: UserResolver
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
