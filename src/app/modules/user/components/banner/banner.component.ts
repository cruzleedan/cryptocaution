import { Component, OnInit, Input } from '@angular/core';
import { User, UserService } from '../../../../core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
    baseUrl = environment.baseUrl;
    user: User;
    entityUrl: string;
    reviewUrl: string;
    @Input() user$: Observable<User>;
    constructor(
        private userService: UserService
    ) {

    }
    ngOnInit() {
        this.user$.subscribe(user => {
            console.log('banner', user);
            this.user = user;
            this.entityUrl = `/user/entities${user['userId'] ? '/' + user['userId'] : ''}`;
            this.reviewUrl = `/user/reviews${user['userId'] ? '/' + user['userId'] : ''}`;
        });
    }

}
