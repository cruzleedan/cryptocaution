import { Component, OnInit, ViewChild, NgZone, HostListener } from '@angular/core';
import { UserService, User, AlertifyService } from '../../../../core';
import { FormGroup, NgForm, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ShowOnDirtyErrorStateMatcher, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CustomBlob } from '../../../../shared/helpers/custom-blob';
import { ImageCropperDialogComponent } from '../../../../shared/cropper/image-cropper-dialog.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PasswordComponent } from './components/password/password.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    @ViewChild(ProfileComponent) profile;
    @ViewChild(PasswordComponent) password;
    // @HostListener allows us to also guard against browser refresh, close, etc.
    @HostListener('window:beforeunload', ['$event'])
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        return this.password.canDeactivate() && this.profile.canDeactivate();
    }
    constructor(

    ) {


    }
    ngOnInit() {

    }

}
