import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-success-dialog',
    templateUrl: './success-dialog.component.html',
    styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent implements OnInit {
    id: number;
    msg: string;
    constructor(
        public dialogRef: MatDialogRef<SuccessDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    ngOnInit() {
        this.id = this.data.id;
        this.msg = this.data.msg || '';
    }
    closeDialog() {
        this.dialogRef.close();
    }

}
