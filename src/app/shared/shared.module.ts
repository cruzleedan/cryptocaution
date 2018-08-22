import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

import { LayoutModule } from '@angular/cdk/layout';

import {
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatCheckboxModule,
    ErrorStateMatcher,
    ShowOnDirtyErrorStateMatcher,
    MatIconRegistry,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatCardModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatDividerModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule
} from '@angular/material';

import { ImageCropperModule } from 'ngx-image-cropper';
import { StarRatingModule } from 'angular-star-rating';
import { QuillModule } from 'ngx-quill';
import { Ng2OdometerModule } from 'ng2-odometer';

import { ListErrorsComponent } from './list-errors.component';
import { ShowAuthedDirective } from './directives/show-authed.directive';
import { ShowAdminDirective } from './directives/show-admin.directive';
import { ClosePopoverOnOutsideClickDirective } from './directives/close-popover-on-outside-click.directive';
import { EnforcedInputsDirective } from './directives/enforced-inputs.directive';
import { SearchBarComponent } from './search-bar';
import { HeaderComponent, FooterComponent } from './layout';
import { CategoryMenuComponent } from './category-menu';
import { StrToJSONPipe } from './pipes/str-to-json.pipe';
import { ReadMoreComponent } from './read-more/read-more.component';
import { CustomBlob } from './helpers/custom-blob';
import { MatIcons } from './helpers/mat-icons';
import { MsgDialogComponent } from './dialog/msg-dialog.component';
import { PctPipe } from './pipes/pct.pipe';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ImageCropperDialogComponent } from './cropper/image-cropper-dialog.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { DateTimeMomentFormatPipe } from './pipes/date-time-moment-format.pipe';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { SidemenuItemComponent } from './sidemenu-item/sidemenu-item.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { NavSearchBarComponent } from './nav-search-bar/nav-search-bar.component';
import { ToolbarNotificationComponent } from './toolbar-notification/toolbar-notification.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminComponent } from './layout/template/admin/admin.component';
import { AuthComponent } from './layout/template/auth/auth.component';
import { CategoryMenuItemComponent } from './category-menu-item/category-menu-item.component';
import { BreadcrumbsComponent } from './breadcrumb/breadcrumbs.component';
import { RatingLabelPipe } from './pipes/rating-label.pipe';
import { EntityDeleteComponent } from './entity-delete/entity-delete.component';
import { ReviewDeleteComponent } from './review-delete/review-delete.component';
import { DefaultComponent } from './layout/template/default/default.component';
@NgModule({
    imports: [
        CommonModule,
        CdkAccordionModule,
        FlexLayoutModule,
        LayoutModule,
        ImageCropperModule,
        // Start material components
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatListModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatNativeDateModule,
        MatExpansionModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatBadgeModule,
        MatCardModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatDividerModule,
        MatDialogModule,
        MatChipsModule,
        MatProgressBarModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatTooltipModule,
        // End material components
        PerfectScrollbarModule,
        Ng2OdometerModule,
        StarRatingModule.forRoot(),
        QuillModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
    ],
    declarations: [
        ListErrorsComponent,
        ShowAuthedDirective,
        ShowAdminDirective,
        ClosePopoverOnOutsideClickDirective,
        EnforcedInputsDirective,
        SearchBarComponent,
        HeaderComponent,
        FooterComponent,
        CategoryMenuComponent,
        MsgDialogComponent,
        // Start Pipes
        StrToJSONPipe,
        PctPipe,
        DateTimeMomentFormatPipe,
        CapitalizePipe,
        RatingLabelPipe,
        // End Pipes
        ReadMoreComponent,
        AuthFormComponent,
        LoadingSpinnerComponent,
        ImageCropperDialogComponent,
        SidemenuComponent,
        SidemenuItemComponent,
        ToolbarComponent,
        FullscreenComponent,
        NavSearchBarComponent,
        ToolbarNotificationComponent,
        UserMenuComponent,
        SidebarComponent,
        AdminComponent,
        AuthComponent,
        CategoryMenuItemComponent,
        BreadcrumbsComponent,
        EntityDeleteComponent,
        ReviewDeleteComponent,
        DefaultComponent,

    ],
    exports: [
        CommonModule,
        CdkAccordionModule,
        FlexLayoutModule,
        LayoutModule,
        ImageCropperModule,
        // Start material components
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatListModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatNativeDateModule,
        MatExpansionModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatBadgeModule,
        MatCardModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatDividerModule,
        MatDialogModule,
        MatChipsModule,
        MatProgressBarModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatTooltipModule,
        // End material components
        // Start Pipes
        StrToJSONPipe,
        PctPipe,
        DateTimeMomentFormatPipe,
        CapitalizePipe,
        RatingLabelPipe,
        // End Pipes
        StarRatingModule,
        QuillModule,
        Ng2OdometerModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
        ListErrorsComponent,
        ShowAuthedDirective,
        ShowAdminDirective,
        ClosePopoverOnOutsideClickDirective,
        EnforcedInputsDirective,
        SearchBarComponent,
        HeaderComponent,
        FooterComponent,
        CategoryMenuComponent,
        ReadMoreComponent,
        MsgDialogComponent,
        AuthFormComponent,
        LoadingSpinnerComponent,
        ImageCropperDialogComponent,
        PerfectScrollbarModule,
        SidemenuComponent,
        SidemenuItemComponent,
        ToolbarComponent,
        FullscreenComponent,
        NavSearchBarComponent,
        ToolbarNotificationComponent,
        UserMenuComponent,
        SidebarComponent,
        AdminComponent,
        DefaultComponent,
        AuthComponent,
        BreadcrumbsComponent,
        EntityDeleteComponent,
        ReviewDeleteComponent,
    ],
    providers: [
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        MatIconRegistry,
        DatePipe,
        CustomBlob,
        MatIcons
    ],
    entryComponents: [
        MsgDialogComponent,
        ImageCropperDialogComponent,
    ]
})
export class SharedModule {
    constructor(public matIconRegistry: MatIconRegistry) {
        matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    }
}
