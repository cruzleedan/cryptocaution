import { Component, OnInit, NgZone, HostListener, ViewChild, Input, ElementRef } from '@angular/core';
import { ImageCropperDialogComponent } from '../../../../../../shared/cropper/image-cropper-dialog.component';
import { Observable, of } from 'rxjs';
import { take, map, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { FormControl, Validators, FormBuilder, NgForm, FormGroup, AbstractControl } from '@angular/forms';
import { ShowOnDirtyErrorStateMatcher, MatDialog } from '@angular/material';
import { AlertifyService, UserService, User } from '../../../../../../core';
import { ValidationMessage } from '../../../../../../core/validators/validation.message';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CustomBlob } from '../../../../../../shared/helpers/custom-blob';
import { PasswordValidator } from '../../../../../../core/validators/password.validator';
import { environment } from '../../../../../../../environments/environment';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    baseUrl = environment.baseUrl;
    @Input() operation: string;
    @Input() user: User;
    roles = ['admin'];
    isEdit: boolean;
    isNew: boolean;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    uploadProgress;
    uploadProgressCompleted = false;
    uploading = false;
    submitting: boolean;
    userForm: FormGroup;
    matcher;
    showCurrPass: boolean;
    showNewPass: boolean;
    showConfPass: boolean;
    matchingPass: FormGroup;
    editPass: boolean;
    userAvatarUrl: string;
    @ViewChild('autosize') autosize: CdkTextareaAutosize;
    @ViewChild('form')
    form: NgForm;
    @ViewChild('avatarImgFile') avatarImgFile: ElementRef;
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
        this.matchingPass = new FormGroup({
            new: new FormControl('',
                Validators.compose([
                    Validators.minLength(5),
                    Validators.required,
                    // this is for the letters (both uppercase and lowercase) and numbers validation
                    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
                ])
            ),
            confirm: new FormControl('', [Validators.required])
        }, {validators: PasswordValidator.areEqual});
        this.userForm = this.fb.group({
            'username': new FormControl('', [Validators.required, Validators.minLength(3)]),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'firstname': new FormControl(''),
            'lastname': new FormControl(''),
            'gender': new FormControl(''),
            'desc': new FormControl(''),
            'roles': new FormControl('')
        });

    }
    ngOnInit() {

        this.isEdit = !!(this.operation === 'edit');
        this.isNew = !!(this.operation === 'new');

        console.log('operation is ', this.operation);

        if (this.user && this.isEdit) {
            console.log('patch user form', this.user);
            this.userForm.patchValue(this.user);
            if (this.user.id && this.user.avatar) {
                this.userAvatarUrl = `${this.baseUrl}/avatar/${ this.user.id }/${ this.user.avatar }`;
            }
        }
        const usernameCtrl = this.userForm.controls['username'];
        usernameCtrl.valueChanges.pipe(
            debounceTime(500), // replaces your setTimeout
            map(username => {
                username = username.trim();
                if (this.isNew) {
                    return username;
                } else if (this.isEdit) {
                    const isChanged = username && username !== this.user.username;
                    console.log('current ', username, ' username ', this.user.username, ' ', isChanged);
                    return isChanged ? username : false;
                }
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
            'desc': '',
            'roles': ''
        });
        this.croppedImage = '';
        if (this.user && this.isEdit) {
            this.userForm.patchValue(this.user);
            if (this.user.id && this.user.avatar) {
                this.userAvatarUrl = `${this.baseUrl}/avatar/${ this.user.id }/${ this.user.avatar }`;
            }
        }
        this.avatarImgFile.nativeElement.value = '';
    }
    toggleEditPass() {
        this.editPass = !this.editPass;
        if (this.editPass) {
            this.userForm.addControl('matchedPassword', this.matchingPass);
        } else {
            this.userForm.removeControl('matchedPassword');
        }
    }
    handleSubmit() {
        this.submitting = true;
        const formValues = this.userForm.value;
        console.log('Submit user form', formValues);
        let imageFile;
        if (this.croppedImage) {

            const blob = this.customBlob.dataURLToBlob(this.croppedImage);
            imageFile = this.customBlob.blobToFile(blob, `avatar-${Date.now()}.png`);
        }
        let req;
        if (this.isEdit) {
            req = this.userService.updateProfile(
                this.croppedImage ? imageFile : null,
                formValues,
                this.user.id
            );
        } else if (this.isNew) {
            req = this.userService.create(
                this.croppedImage ? imageFile : null,
                formValues
            );
        }

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
                console.log('resp', resp);
                if (resp.success) {
                    console.log('user updated info', resp['user']);
                    this.userForm.patchValue(resp['user']);
                    if (resp['user'] && resp['user'].avatar) {
                        this.userAvatarUrl = `${this.baseUrl}/avatar/${ resp['user'].id }/${ resp['user'].avatar }`;
                    }
                    this.alertifyService.success('Successfully saved!');
                } else {
                    this.alertifyService.error('Something went wrong while creating new user.');
                }
                this.submitting = false;
            });
        }
    }
}
