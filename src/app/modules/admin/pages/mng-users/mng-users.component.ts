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
    user: User;
    constructor(
        private route: ActivatedRoute
    ) {
        this.route.params.subscribe(param => {
            this.user = this.route.snapshot.data.user;
            console.log('edit user', this.user);
            this.isEdit = !!(param.id);
        });
    }

    ngOnInit() {
    }

}
