import { Component, OnInit, Input } from '@angular/core';
import { User, UserService } from '../../../../core';
import { environment } from '../../../../../environments/environment';
@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
    baseUrl = environment.baseUrl;
    user: User;
    constructor(
        private userService: UserService
    ) {
        this.userService.currentUser
            .subscribe(user => {
                this.user = user;
            });
    }
    ngOnInit() {
    }

}
