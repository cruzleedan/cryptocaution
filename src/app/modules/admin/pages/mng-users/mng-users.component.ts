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
            this.checkNew();
            this.user = this.route.snapshot.data.user;
            console.log('edit user', this.user);
            this.isEdit = !!(param.id);
            this.operation = 'edit';
        });
    }

    ngOnInit() {
        this.checkNew();
    }
    checkNew() {
        try {
            const url = this.route.snapshot['_routerState'].url,
            urlSegment = url.split('/').pop();
            this.isNew = !!(urlSegment === 'new');
            this.operation = 'new';
        } catch (e) {
            console.log('Something went wrong while checking if isNew or not. ', e);

        }
    }

}
