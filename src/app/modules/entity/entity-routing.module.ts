import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityComponent } from './pages/entity.component';
import { EntityResolver } from './resolvers/entity-resolver.service';
import { NewComponent } from './pages/new/new.component';
import { AuthGuard, Breadcrumb } from '../../core';
import { CanDeactivateGuard } from '../../core/guards/can-deactivate/can-deactivate.guard';
import { NewReviewComponent } from './pages/new-review/new-review.component';
import { EntityReviewResolver } from './resolvers/entity-review-resolver.service';
import { AdminGuard } from '../../core/guards/admin.guard';
import { AdminOrEntityOwnerGuard } from '../../core/guards/admin-or-entity-owner.guard';
import { ReviewComponent } from './pages/review/review.component';
import { EntityReviewCheckResolver } from './resolvers/entity-review-check-resolver';
import { EntityFullReviewResolver } from './resolvers/entity-full-review-resolver';

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
        canActivate: [AuthGuard, AdminOrEntityOwnerGuard],
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
            review: EntityReviewCheckResolver
        }
    },
    {
        path: ':id/review/edit',
        component: NewReviewComponent,
        resolve: {
            review: EntityReviewResolver
        }
    },
    {
        path: ':entityId/review/:reviewId',
        component: ReviewComponent,
        resolve: {
            review: EntityFullReviewResolver
        }
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }
