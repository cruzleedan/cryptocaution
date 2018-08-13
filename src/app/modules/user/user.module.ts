import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SharedModule } from '../../shared';
import { BannerComponent } from './components/banner/banner.component';
import { AuthGuard } from '../../core';
import { PasswordComponent } from './pages/settings/components/password/password.component';
import { ProfileComponent } from './pages/settings/components/profile/profile.component';

@NgModule({
    imports: [
        SharedModule,
        UserRoutingModule
    ],
    declarations: [ReviewsComponent, SettingsComponent, BannerComponent, PasswordComponent, ProfileComponent]
})
export class UserModule { }
