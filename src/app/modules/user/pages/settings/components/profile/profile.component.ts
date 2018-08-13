import { Component, OnInit, ViewChild, HostListener, NgZone } from '@angular/core';
import { User, UserService, AlertifyService } from '../../../../../../core';
import { FormGroup, NgForm, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { CustomBlob } from '../../../../../../shared/helpers/custom-blob';
import { ImageCropperDialogComponent } from '../../../../../../shared/cropper/image-cropper-dialog.component';
import { take, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ValidationMessage } from '../../../../../../core/validators/validation.message';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    user: User;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    uploadProgress;
    uploadProgressCompleted = false;
    uploading = false;
    userForm: FormGroup;
    matcher;
    @ViewChild('autosize') autosize: CdkTextareaAutosize;
    @ViewChild('form')
    form: NgForm;
    validationMessages = ValidationMessage.msg;


    // @HostListener allows us to also guard against browser refresh, close, etc.
    @HostListener('window:beforeunload', ['$event'])
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        return this.form.submitted || !this.form.dirty;
    }
    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private customBlob: CustomBlob,
        private ngZone: NgZone,
        private userService: UserService,
        private alertifyService: AlertifyService
    ) {
        this.matcher = new ShowOnDirtyErrorStateMatcher;
        this.userForm = this.fb.group({
            'username': new FormControl('', Validators.compose([
                // Validators.maxLength(25),
                Validators.minLength(3),
                // Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
                Validators.required
            ])),
            'firstname': new FormControl(''),
            'lastname': new FormControl(''),
            'gender': new FormControl(''),
            'desc': new FormControl('')
        });
        this.userService.currentUser
            .subscribe(user => {
                this.user = user;
                this.userForm.patchValue(user);
            });

    }
    ngOnInit() {
        const usernameCtrl = this.userForm.controls['username'];
        usernameCtrl.valueChanges.pipe(
            debounceTime(500), // replaces your setTimeout
            map(username => {
                username = username.trim();
                const isChanged = username && username !== this.user.username;
                console.log('current ', username, ' username ', this.user.username, ' ', isChanged);
                return isChanged ? username : false;
            }),
            distinctUntilChanged(), // wait until it's different than what we last checked
            switchMap(desiredUsername => this.userService.checkUsernameNotTaken(desiredUsername)),
            tap(exists => {
                if (exists) {
                    usernameCtrl.setErrors({ usernameTaken: true });
                } else if (usernameCtrl.errors && usernameCtrl.errors.hasOwnProperty('usernameTaken')) {
                    delete usernameCtrl.errors.usernameTaken;
                }
            })
        ).subscribe();
    }
    fileChangeEvent(event: any): void {
        // this.imageChangedEvent = event;
        console.log('fileChangeEvent fired!');

        const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
            data: {
                event: event
            },
            width: '50%',
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.croppedImage = result;
        });
    }
    imageCropped(image: string) {
        this.croppedImage = image;
    }
    imageLoaded() {
        // show cropper
    }
    loadImageFailed() {
        // show message
    }
    openCropperDialog() {
        this.dialog.open(ImageCropperDialogComponent, {
            data: {}
        });
    }
    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this.ngZone.onStable.pipe(take(1))
            .subscribe(() => this.autosize.resizeToFitContent(true));
    }
    // form submission and reset
    resetForm() {
        this.userForm.reset({
            'username': '',
            'firstname': '',
            'lastname': '',
            'gender': '',
            'desc': ''
        });
        this.croppedImage = '';
        this.userForm.patchValue(this.user);
    }
    handleSubmit() {
        const formValues = this.userForm.value;
        console.log('Submit user form', formValues);
        let imageFile;
        if (this.croppedImage) {

            const blob = this.customBlob.dataURLToBlob(this.croppedImage);
            imageFile = this.customBlob.blobToFile(blob, `avatar-${Date.now()}.png`);
        }
        const req = this.userService.updateProfile(
            this.croppedImage ? imageFile : null,
            formValues
        );
        this.uploading = true;
        if (req && req.progress) {
            this.uploadProgress = req.progress;
            this.uploadProgress.subscribe(end => {
                this.uploadProgressCompleted = true;
                this.uploading = false;
            });
        }
        if (req && req.data) {
            req.data.subscribe((resp) => {
                this.resetForm();
                this.userService.populate();
                this.alertifyService.success('Successfully saved!');
            });
        }
    }

}
