import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing-module';

import { HttpService } from './core/errors/services/http/http.service';
import { NotificationService } from './core/errors/services/notification/notification.service';
import { ErrorsModule } from './core/errors/errors';

import {
    SharedModule,
    TemplateComponent
} from './shared';

import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './core';
import { CanDeactivateGuard } from './core/guards/can-deactivate/can-deactivate.guard';
import { Globals } from './globals';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH, faCommentAlt, faEnvelope, faLink, faPrint, faMinus } from '@fortawesome/free-solid-svg-icons';
library.add(faEllipsisH, faCommentAlt, faEnvelope, faLink, faPrint, faMinus);
import {
    faFacebookF, faTwitter, faGooglePlusG, faLinkedinIn, faPinterestP,
    faRedditAlien, faTumblr, faWhatsapp, faFacebookMessenger, faTelegramPlane,
    faVk, faStumbleupon, faXing
} from '@fortawesome/free-brands-svg-icons';

library.add(
    faFacebookF, faTwitter, faGooglePlusG, faLinkedinIn, faPinterestP,
    faRedditAlien, faTumblr, faWhatsapp, faFacebookMessenger, faTelegramPlane,
    faVk, faStumbleupon, faXing
);


@NgModule({
    declarations: [
        AppComponent,
        TemplateComponent
    ],
    imports: [
        BrowserModule,
        CoreModule,
        BrowserAnimationsModule,
        SharedModule,
        AuthModule,
        AppRoutingModule,
        ErrorsModule
    ],
    exports: [
        BrowserAnimationsModule,
    ],
    providers: [
        Globals,
        CookieService,
        HttpService,
        CanDeactivateGuard,
        NotificationService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
