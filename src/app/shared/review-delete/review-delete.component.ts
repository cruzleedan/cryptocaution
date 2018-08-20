import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { UserService, AlertifyService } from '../../core';
import { MsgDialogComponent } from '../dialog/msg-dialog.component';
import { Review } from '../../core/models/review.model';

@Component({
    selector: 'app-review-delete',
    templateUrl: './review-delete.component.html',
    styleUrls: ['./review-delete.component.scss']
})
export class ReviewDeleteComponent implements OnInit {
    @Input() review: Review;
    @Output() afterDelete: EventEmitter<any> = new EventEmitter();
    constructor(
        private dialog: MatDialog,
        private userService: UserService,
        private alertifyService: AlertifyService
    ) { }

    ngOnInit() {
    }
    onDelete(entityId: string) {
        const dialogRef = this.dialog.open(MsgDialogComponent, {
            data: {
                type: 'confirm',
                msg: 'Are you sure, you want to delete this review?'
            },
            width: '500px',
            hasBackdrop: true,
            panelClass: ''
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.proceed) {
                console.log('Will be deleting entity review', entityId);

                this.userService.deleteReview(entityId)
                    .subscribe(del => {
                        console.log('del', del);
                        if (del) {
                            this.alertifyService.success('Successfully deleted review');
                            this.afterDelete.emit({success: true});
                        }
                    });
            }
        });
    }
}
