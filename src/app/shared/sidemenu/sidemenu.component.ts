import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService, User } from '../../core';
@Component({
    selector: 'app-sidemenu',
    templateUrl: './sidemenu.component.html',
    styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
    baseUrl = environment.baseUrl;
    @Input() iconOnly = false;
    @Input() menus;
    user: User;
    constructor(
        private userService: UserService
    ) {
        userService.currentUser.subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
    }

}
