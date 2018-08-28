import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { MsgDialogComponent } from '../../../../shared/dialog/msg-dialog.component';



@Injectable()
export class NotificationService {

    private _notification: BehaviorSubject<string> = new BehaviorSubject(null);
    readonly notification$: Observable<string> = this._notification.asObservable();

    constructor(private dialog: MatDialog) { }

    notify(message, title?) {
        this._notification.next(message);
        console.log('Notification Service', message, title);

        this._notification.next(message);
        this.dialog.open(MsgDialogComponent, {
            data: {
                msg: title || 'Something went wrong!',
                details: message,
                type: 'error',
                title: 'Oops!'
            },
            width: '300px',
            hasBackdrop: true,
            panelClass: 'error'
        });
    }

}
