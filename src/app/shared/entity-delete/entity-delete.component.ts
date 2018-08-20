import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { UserService, AlertifyService } from '../../core';
import { Entity } from '../../core/models/entity.model';
import { MsgDialogComponent } from '../dialog/msg-dialog.component';

@Component({
    selector: 'app-entity-delete',
    templateUrl: './entity-delete.component.html',
    styleUrls: ['./entity-delete.component.scss']
})
export class EntityDeleteComponent implements OnInit {

    @Input() entity: Entity;
    @Output() afterDelete: EventEmitter<any> = new EventEmitter();
    constructor(
        private dialog: MatDialog,
        private userService: UserService,
        private alertifyService: AlertifyService
    ) { }
    ngOnInit() {
    }
    onDelete(entity: Entity) {
        const dialogRef = this.dialog.open(MsgDialogComponent, {
            data: {
                type: 'confirm',
                msg: `Are you sure, you want to delete ${entity.name}?`
            },
            width: '500px',
            hasBackdrop: true,
            panelClass: ''
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.proceed) {

                this.userService.deleteEntity(entity.id)
                    .subscribe(del => {
                        if (del) {
                            this.alertifyService.success('Successfully deleted');
                            this.afterDelete.emit({success: true});
                        }
                    });
            }
        });
    }
}
