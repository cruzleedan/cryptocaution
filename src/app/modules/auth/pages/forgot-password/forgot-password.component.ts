import { Component, OnInit, HostListener, ViewChild, Output } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertifyService, UserService } from '../../../../core';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { ValidationMessage } from '../../../../core/validators/validation.message';
import { PasswordValidator } from '../../../../core/validators/password.validator';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    showCurrPass: boolean;
    showNewPass: boolean;
    showConfPass: boolean;
    pwdForm: FormGroup;
    matchingPass: FormGroup;
    matcher;
    token;
    validationMessages = ValidationMessage.msg;
    @ViewChild('form')
    form: NgForm;
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
        private alertifyService: AlertifyService,
        private userService: UserService,
        private route: ActivatedRoute,
        public authService: AuthService
    ) {
        this.route.queryParams.subscribe(params => {
            console.log('PARAMS', params);
            this.token = params.token;
        });
        this.matcher = new ShowOnDirtyErrorStateMatcher;
        this.pwdForm = new FormGroup({name: new FormControl()});
    }

    ngOnInit() {
    }
    handleSubmit() {
        this.authService.authenticatingSubject.next(true);
        const formVal = this.pwdForm.value;
        this.userService.forgotPasswordReset(formVal.matchedPassword.new, this.token)
        .subscribe(
            resp => {
                this.authService.authenticatingSubject.next(false);
                console.log('resp', resp);
                if (resp['success']) {
                    this.alertifyService.success('Successfully updated');
                    this.pwdForm.reset({});
                } else {
                    this.alertifyService.error('Failed to update your password, please try again.');
                }
            },
            err => {
                this.authService.authenticatingSubject.next(false);
                console.log('err', err);
                if (typeof err.error === 'object') {
                    err.error = err.error.hasOwnProperty('error') && typeof err.error.error === 'object' ? err.error.error : err.error;
                    Object.keys(err.error).forEach(field => {
                        if (typeof err.error[field] === 'object') {
                            const innerField = Object.keys(err.error[field])[0];
                            const error = err.error[field][innerField];
                            this.pwdForm.get(field).get(innerField).setErrors({'server': error});
                        } else {
                            this.pwdForm.get(field).setErrors({'server': err.error[field]});
                        }
                    });
                } else {

                }
            }
        );
    }
    resetForm() {
        this.pwdForm.reset({});
    }

}
