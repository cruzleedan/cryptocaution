import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MsgDialogComponent } from '../../shared/dialog/msg-dialog.component';
import { AlertifyService } from './alertify.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private dialog: MatDialog,
        private alertifyService: AlertifyService
    ) { }
    showAuthFormPopup() {
        console.log('showAuthFormPopup');

        const dialogRef = this.dialog.open(MsgDialogComponent, {
            data: {
                isAuth: true
            },
            width: '500px',
            hasBackdrop: true,
            panelClass: ''
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.data && resp.data.success) {
                this.alertifyService.success('Successfully logged in');
            }
        });
    }
}
