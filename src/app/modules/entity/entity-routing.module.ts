import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityComponent } from './pages/entity.component';
import { EntityResolver } from './entity-resolver.service';
import { NewComponent } from './pages/new/new.component';
import { AuthGuard, Breadcrumb } from '../../core';
import { CanDeactivateGuard } from '../../core/guards/can-deactivate/can-deactivate.guard';
import { NewReviewComponent } from './pages/new-review/new-review.component';
import { EntityReviewResolver } from './entity-review-resolver.service';
import { AdminGuard } from '../../core/guards/admin.guard';
import { AdminOrEntityOwnerGuard } from '../../core/guards/admin-or-entity-owner.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/category',
        pathMatch: 'full',
        canActivate: [AdminGuard]
    },
    {
        path: 'new',
        component: NewComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            breadcrumbs: [
                new Breadcrumb('Entities', '/entity')
            ]
        }
    },
    {
        path: ':id',
        component: EntityComponent,
        resolve: {
            entity: EntityResolver
        },
        data: {
            breadcrumbs: [
                new Breadcrumb('Entities', '/entity')
            ]
        }
    },
    {
        path: ':id/edit',
        component: NewComponent,
        canActivate: [AdminOrEntityOwnerGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            breadcrumbs: [
                new Breadcrumb('Entities', '/entity')
            ]
        }
    },
    {
        path: ':id/review/new',
        component: NewReviewComponent,
        resolve: {
            review: EntityReviewResolver
        }
    },
    {
        path: ':id/review/edit',
        component: NewReviewComponent,
        resolve: {
            review: EntityReviewResolver
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }
