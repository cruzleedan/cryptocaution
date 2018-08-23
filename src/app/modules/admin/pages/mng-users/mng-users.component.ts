import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../core';

@Component({
    selector: 'app-mng-users',
    templateUrl: './mng-users.component.html',
    styleUrls: ['./mng-users.component.scss']
})
export class MngUsersComponent implements OnInit {
    isEdit: boolean;
    isNew: boolean;
    operation: string;
    user: User;
    constructor(
        private route: ActivatedRoute
    ) {
        console.log('route', route);
        this.route.params.subscribe(param => {
            this.checkOperation();
            this.user = this.route.snapshot.data.user;
            this.operation = this.isEdit ? 'edit' : (this.isNew ? 'new' : '');
        });
    }

    ngOnInit() {
        this.checkOperation();
    }
    checkOperation() {
        try {
            const url = this.route.snapshot['_routerState'].url,
            urlSegment = url.split('/').pop();
            this.isNew = !!(urlSegment === 'new');
            this.isEdit = !!(urlSegment === 'edit');
        } catch (e) {
            console.log('Something went wrong while checking if isNew or not. ', e);

        }
    }

}
