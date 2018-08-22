import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';



@Injectable()
export class NotificationService {

  private _notification: BehaviorSubject<string> = new BehaviorSubject(null);
  readonly notification$: Observable<string> = this._notification.asObservable();

  constructor() {}

  notify(message) {
    this._notification.next(message);
    console.log('Notification Service', message);

    setTimeout(() => this._notification.next(null), 3000);
  }

}
