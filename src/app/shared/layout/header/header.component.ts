import { Component, OnInit } from '@angular/core';
import { UserService, User, EntityService } from '../../../core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    baseUrl = environment.baseUrl;
    currentUser: User;
    toolbar: any = {};
    isHandset$: Observable<boolean> = this.breakpointObserver.observe([
        Breakpoints.HandsetPortrait
        , Breakpoints.Small
    ])
        .pipe(
            map(result => result.matches)
        );
    constructor(
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private userService: UserService
    ) {
        this.userService.currentUser.subscribe(
            (userData) => {
                this.currentUser = userData;
                this.toolbar.currentUser = {
                    photoURL: `${this.baseUrl}/avatar/${userData.id}/${userData.avatar}`,
                    currentUserName: userData.username
                };
            }
        );
    }

    ngOnInit() {
    }
    logout() {
        this.userService.purgeAuth();
        this.router.navigateByUrl('/login');
    }
}
