import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertifyService, UserService } from '../../../../../../core';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { ValidationMessage } from '../../../../../../core/validators/validation.message';
import { PasswordValidator } from '../../../../../../core/validators/password.validator';

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
    loading = false;
    showCurrPass: boolean;
    showNewPass: boolean;
    showConfPass: boolean;
    pwdForm: FormGroup;
    matchingPass: FormGroup;
    matcher;
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
        private userService: UserService
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
        this.pwdForm = this.fb.group({
            current: new FormControl('', [Validators.required]),
            matchedPassword: this.matchingPass
        });
    }

    ngOnInit() {
    }
    handleSubmit() {
        this.loading = true;
        const formVal = this.pwdForm.value;
        this.userService.passwordReset(formVal.current, formVal.matchedPassword.new)
        .subscribe(
            resp => {
                console.log('resp', resp);

                this.loading = false;
                if (resp['success']) {
                    this.alertifyService.success('Successfully updated');
                    this.pwdForm.reset({});
                } else {
                    this.alertifyService.error('Failed to update your password, please try again.');
                }
            },
            err => {
                this.loading = false;
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
