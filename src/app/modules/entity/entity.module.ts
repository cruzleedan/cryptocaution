import { NgModule } from '@angular/core';

import { EntityRoutingModule } from './entity-routing.module';
import { SharedModule } from '../../shared';
import { EntityComponent } from './pages/entity.component';
import { NewComponent } from './pages/new/new.component';
import { EntityResolver } from './entity-resolver.service';
import { SuccessDialogComponent } from './pages/new/components/success-dialog.component';
import { ReviewComponent } from './pages/review/review.component';
import { NewReviewComponent } from './pages/new-review/new-review.component';
import { EntityReviewResolver } from './entity-review-resolver.service';

@NgModule({
    imports: [
        SharedModule,
        EntityRoutingModule
    ],
    declarations: [
        EntityComponent,
        NewComponent,
        SuccessDialogComponent,
        ReviewComponent,
        NewReviewComponent
    ],
    providers: [EntityResolver, EntityReviewResolver],
    exports: [
        SuccessDialogComponent
    ],
    entryComponents: [
        SuccessDialogComponent
    ],
})
export class EntityModule { }
