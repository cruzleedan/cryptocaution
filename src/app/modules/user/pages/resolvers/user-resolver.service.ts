import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User, UserService } from '../../../../core';

@Injectable({
    providedIn: 'root'
})
export class UserResolverService implements Resolve<any> {

    constructor(private userService: UserService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.userService.findUserById(route.params['id']);
    }

}
