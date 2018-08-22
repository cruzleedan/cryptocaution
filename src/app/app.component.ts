import { Component, OnInit } from '@angular/core';
import { NotificationService } from './core/errors/services/notification/notification.service';
import { UserService } from './core';
import { ActivatedRoute } from '../../node_modules/@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';
    notification: string;
    showNotification: boolean;
    isAdmin: boolean;
    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        // private notificationService: NotificationService
    ) { }

    ngOnInit() {
        console.log('URL', this.route.snapshot);
        const url = this.route.snapshot['_routerState'].url;
        console.log('URL', url);

        this.userService.populate();
        // this.notificationService
        //   .notification$
        //   .subscribe(message => {
        //     this.notification = message;
        //     this.showNotification = true;
        //   });
    }
}
