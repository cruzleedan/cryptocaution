import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '..';
import { map, take, last } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log('no auth guard', this.userService.isAuthenticated);

        return this.userService.isAuthenticated.pipe(
            map(isAuthenticated => {
                const currentUser = this.userService.getCurrentUser();
                console.log('isAuthenticated', isAuthenticated);
                console.log('currentUser', currentUser);
                return !isAuthenticated && !currentUser.username;
            })
        );
        // const currentUser = this.userService.getCurrentUser();
        // if (currentUser && currentUser.username) {
        //     return false;
        // } else {
        //     return true;
        // }
    }
}
