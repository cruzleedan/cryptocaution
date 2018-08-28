import { Injectable, NgZone } from '@angular/core';
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
        private router: Router,
        private zone: NgZone,
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log('no auth guard', this.userService.isAuthenticated);

        return this.userService.isAuthenticated.pipe(
            map(isAuthenticated => {
                console.log('isAuthenticated', isAuthenticated);
                if (isAuthenticated) {
                    console.log('Will redirect to home');

                    this.router.navigate(['/home']);
                    return false;
                }
                return !isAuthenticated;
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
