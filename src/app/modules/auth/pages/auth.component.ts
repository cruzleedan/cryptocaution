import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, Errors } from '../../../core';
import { ShowOnDirtyErrorStateMatcher, MatDialog } from '@angular/material';
import { MsgDialogComponent } from '../../../shared/dialog/msg-dialog.component';

@Component({
    selector: 'app-auth-page',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    authType: String = '';
    authError = '';
    isLogin: Boolean;
    isRegister: Boolean;
    title: String = '';
    errors = {error: ''};
    isSubmitting = false;
    authForm: FormGroup;
    matcher = new ShowOnDirtyErrorStateMatcher();
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private fb: FormBuilder,
        private dialog: MatDialog
    ) {
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
        this.route.url.subscribe(data => {
            // Get the last piece of the URL (it's either 'login' or 'register')
            this.authType = data[data.length - 1].path;
            this.isLogin = this.authType === 'login';
            this.isRegister = this.authType === 'register';
            // Set a title for the page accordingly
            this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
            // add form control for username if this is the register page
            if (this.authType === 'register') {
                this.authForm.addControl('email', new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]));
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
                    if (resp['success']) {
                        this.router.navigateByUrl('/');
                    } else if (resp['error'] && resp['error']['error']) {
                        this.authError = resp['error']['error'] || 'Something went wrong while logging you in';
                    } else if (resp['error'] && resp['error']['errors']) {
                        resp['error']['errors'].forEach(error => {
                            this.authForm.get(error.param).setErrors({server: error.msg});
                        });
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
