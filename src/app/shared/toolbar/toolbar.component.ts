import { Component, OnInit, Input } from '@angular/core';
import { ToolbarHelpers } from './toolbar.helper';
import { UserService, User } from '../../core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
    baseUrl = environment.baseUrl;
    @Input() sidenav;
    @Input() sidebar;
    @Input() drawer;
    @Input() matDrawerShow;

    searchOpen = false;
    toolbarHelpers = ToolbarHelpers;
    user: User;
    constructor(
        private userService: UserService
    ) {
        userService.currentUser
        .subscribe(user => {
            this.user = user;
            this.toolbarHelpers.currentUser.currentUserName = this.user.username;
            this.toolbarHelpers.currentUser.photoURL = this.user.avatar ? `${this.baseUrl}/avatar/${this.user.id}/${this.user.avatar}` : '';
        });
    }

    ngOnInit() {
    }

}
