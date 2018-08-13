import { Component, OnInit } from '@angular/core';
import { NotificationService } from './core/errors/services/notification/notification.service';
import { UserService } from './core';

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
    // private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.userService.populate();
    // this.notificationService
    //   .notification$
    //   .subscribe(message => {
    //     this.notification = message;
    //     this.showNotification = true;
    //   });
  }
}
