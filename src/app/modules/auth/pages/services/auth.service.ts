import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../../../../core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public authenticatingSubject = new BehaviorSubject(false);
    public authenticating$ = this.authenticatingSubject.asObservable();
    constructor(
        private userService: UserService
    ) {
        this.userService.loadingRequests$.subscribe(requests => {
            const keys = Object.keys(requests);
            const methods = ['requestPasswordReset', 'forgotPasswordReset', 'attemptAuth', 'fbLogin'];
            methods.forEach(method => {
                if (keys.includes(method)) {
                    this.authenticatingSubject.next(requests[method]);
                }
            });
        });
    }
}
