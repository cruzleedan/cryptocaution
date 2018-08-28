import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { take, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private router: Router
    ) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.userService.isAuthenticated
            .pipe(
                map(isAuthenticated => {
                    if (!isAuthenticated) {
                        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
                        return false;
                    }
                    return true;
                })
            );
    }
}
