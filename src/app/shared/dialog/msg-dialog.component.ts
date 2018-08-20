import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../core';

@Component({
    selector: 'app-msg-dialog',
    templateUrl: './msg-dialog.component.html',
    styleUrls: ['./msg-dialog.component.scss']
})
export class MsgDialogComponent implements OnInit {
    title: string;
    confirmBtnTxt: string;
    cancelBtnTxt: string;
    msg: string;
    type: string;
    details: string;
    isAuth = false;
    constructor(
        private userService: UserService,
        public dialogRef: MatDialogRef<MsgDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }
    ngOnInit() {
        if (this.data.type && this.data.type === 'error') {
            this.msg = this.data.msg || 'Something went wrong!';
            this.msg = this.msg.substr(0, 50);
            const msgCont: string = this.data.msg.substr(50) || '';
            this.details =  this.details !== this.msg ? msgCont + this.details : msgCont;
        }
    }
    close() {
        this.dialogRef.close();
    }
    attemptAuth(event) {
        this.userService.isAuthenticated.subscribe(auth => {
            if (auth) {
                this.dialogRef.close(event);
            }
        });
    }
    onConfirm() {
        this.dialogRef.close({proceed: true});
    }
}
