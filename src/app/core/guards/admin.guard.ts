import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { UserService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private router: Router
    ) {

    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.userService.isAdmin
            .pipe(
                take(1),
                map(isAdmin => {
                    if (!isAdmin) {
                        this.router.navigate(['/']);
                        return false;
                    }
                    return true;
                })
            );
    }
}
