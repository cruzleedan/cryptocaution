import { Component, OnInit, Output, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, Errors } from '../../../../core';
import { ShowOnDirtyErrorStateMatcher, MatDialog } from '@angular/material';
import { MsgDialogComponent } from '../../../../shared/dialog/msg-dialog.component';
import { ValidationMessage } from '../../../../core/validators/validation.message';
import { PasswordValidator } from '../../../../core/validators/password.validator';

@Component({
    selector: 'app-signin-signup-page',
    templateUrl: './signup-signin.component.html',
    styleUrls: ['./signup-signin.component.scss']
})
export class SignupSigninComponent implements OnInit {
    authType: String = '';
    authError = '';
    isLogin: Boolean;
    isRegister: Boolean;
    title: String = '';
    errors = {error: ''};
    isSubmitting = false;
    authForm: FormGroup;
    matchingPass: FormGroup;
    returnUrl: string;
    matcher = new ShowOnDirtyErrorStateMatcher();
    validationMessages = ValidationMessage.msg;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private fb: FormBuilder,
        private zone: NgZone,
        private dialog: MatDialog
    ) {
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

        // use FormBuilder to create a form group
        this.authForm = new FormGroup({
            'username': new FormControl('', [
                Validators.required
            ]),
            'password': new FormControl('', [
                Validators.required
            ])
        });
    }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.returnUrl = decodeURIComponent(this.returnUrl);
        this.route.url.subscribe(data => {
            // Get the last piece of the URL (it's either 'login' or 'register')
            this.authType = data[data.length - 1].path;
            this.isLogin = this.authType === 'login';
            this.isRegister = this.authType === 'register';
            // Set a title for the page accordingly
            this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';

            if (this.isRegister) {
                const emailFrmCtrl = new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]);
                if (this.authForm.get('password')) {
                    this.authForm.removeControl('password');
                }
                if (!this.authForm.get('email')) {
                    this.authForm.addControl('email', emailFrmCtrl);
                }
                // if (!this.authForm.get('matchedPassword')) {
                //     this.authForm.addControl('matchedPassword', this.matchingPass);
                // }
            } else if (this.isLogin) {
                if (this.authForm.get('email')) {
                    this.authForm.removeControl('email');
                }
                if (this.authForm.get('matchedPassword')) {
                    this.authForm.removeControl('matchedPassword');
                }
            }
        });
    }
    submitForm() {
        this.isSubmitting = true;
        this.errors = { error: '' };

        const credentials = this.authForm.value;
        this.userService
            .attemptAuth(this.authType, credentials)
            .subscribe(
                resp => {
                    console.log('resp', resp);
                    if (resp && resp['success']) {
                        console.log('Navigate to return Url', this.returnUrl);
                        this.router.navigate([this.returnUrl]);
                    } else if (resp && resp['error'] && resp['error']['error']) {
                        this.authError = resp['error']['error'] || 'Something went wrong while logging you in';
                    } else if (resp && resp['error'] && resp['error']['errors']) {
                        resp['error']['errors'].forEach(error => {
                            this.authForm.get(error.param).setErrors({server: error.msg});
                        });
                    } else {
                        this.authError = 'Something went wrong while logging you in';
                    }
                }
            );
    }
    fbLogin() {
        this.userService.fbLogin()
            .then((cred) => {
                console.log('fblogin ', cred);
                this.userService.fbAuth(cred).subscribe((resp) => {
                    if (resp.success) {
                        this.router.navigate(['/']);
                    } else {
                        console.log('Unsuccessful login');
                    }
                });
            }).catch((err) => {
                const dialogRef = this.dialog.open(MsgDialogComponent, {
                    data: {
                        msg: 'Something went wrong while communicating to the server',
                        type: 'error',
                        title: 'Error',
                        details: err,
                    },
                    width: '300px',
                    hasBackdrop: true,
                    panelClass: 'error'
                });
            });
    }
}

