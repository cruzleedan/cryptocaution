import { NgModule } from '@angular/core';
import { DashcardComponent } from './dashcard/dashcard.component';
import { SharedModule } from '../../../shared';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        DashcardComponent
    ],
    exports: [
        DashcardComponent
    ]
})
export class DashboardWidgetsModule { }
