import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { CanDeactivateGuard } from '../../core/guards/can-deactivate/can-deactivate.guard';
import { EntitiesComponent } from './pages/entities/entities.component';

const routes: Routes = [
    {
        path: 'settings',
        component: SettingsComponent,
        canDeactivate: [CanDeactivateGuard]
    },
    {
        path: 'reviews',
        component: ReviewsComponent
    },
    {
        path: 'entities',
        component: EntitiesComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
