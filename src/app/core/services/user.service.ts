import { Injectable } from '@angular/core';
import { BehaviorSubject, of, ReplaySubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { distinctUntilChanged, map, catchError, reduce, debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { environment } from '../../../environments/environment';
import { AlertifyService } from './alertify.service';
import { Review } from '../models/review.model';
import { HttpParams } from '@angular/common/http';
import { Util } from '../errors/helpers/util';

declare const FB: any;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private currentUserSubject = new BehaviorSubject<User>({} as User);
    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(true);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();

    private isAdminSubject = new BehaviorSubject<boolean>(true);
    public isAdmin = this.isAdminSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    private searchingSubject = new BehaviorSubject<boolean>(false);
    public searching$ = this.searchingSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private jwtService: JwtService,
        private alertifyService: AlertifyService,
        private errorUtil: Util
    ) {
        try {
            FB.init(environment.fbConfig);
        } catch (err) {
            this.alertifyService.error('Something went wrong while connecting to Facebook');
        }
    }

    // Verify JWT in localstorage with server & load user's info.
    // This runs once on application startup.
    populate() {
        console.log('populate called');
        // If JWT detected, attempt to get & store user's info
        if (this.jwtService.getToken()) {
            this.apiService.get('/user')
                .pipe(
                    map(resp => resp),
                    catchError(err => {
                        this.purgeAuth();
                        this.alertifyService.error(this.errorUtil.getError(err) || 'Failed to get account details');
                        return of([]);
                    })
                )
                .subscribe(
                    data => {
                        if (data.success) {
                            this.isAuthenticatedSubject.next(true);
                            this.currentUserSubject.next(data.user);
                            const roles = data.user.roles instanceof Array ? data.user.roles : [];
                            this.isAdminSubject.next(roles.includes('admin'));
                        } else {
                            console.log('Purge user data since data.length is 0');
                            this.purgeAuth();
                        }
                    },
                    err => {
                        console.log('Purge user data due to some error', err);
                        this.purgeAuth();
                    }
                );
        } else {
            console.log('Purge user data since it does not have a token. token is: ', this.jwtService.getToken());

            // Remove any potential remnants of previous auth states
            this.purgeAuth();
        }
    }

    setAuth(user: User) {
        console.log('setAuth is called', user);

        // Save JWT sent from server in localstorage
        this.jwtService.saveToken(user.token);
        // Set current user data into observable
        this.currentUserSubject.next(user);
        // Set isAuthenticated to true
        this.isAuthenticatedSubject.next(true);
        // check if user has admin role
        const roles = user.roles instanceof Array ? user.roles : [];
        this.isAdminSubject.next(roles.includes('admin'));
    }

    purgeAuth() {
        console.log('purgeAuth initiated');
        // Remove JWT from localstorage
        this.jwtService.destroyToken();
        // Set current user to an empty object
        this.currentUserSubject.next({} as User);
        // Set auth status to false
        this.isAuthenticatedSubject.next(false);
        this.isAdminSubject.next(false);
        console.log('purgeAuth completed');
    }

    attemptAuth(type, credentials): Observable<Object> {
        console.log('attemptAuth called');

        const route = (type === 'login') ? '/login' : '';
        return this.apiService.post('/users' + route, credentials, null, true)
            .pipe(
                map(
                    data => {
                        if (!data.success) {
                            this.alertifyService.error(this.errorUtil.getError(data) || 'Authentication Failed.');
                            return of(null);
                        }
                        if (data.success && data.token) {
                            data.user.token = data.token;
                            this.setAuth(data.user);
                        }
                        return data;
                    }
                ),
                catchError(err => {
                    const error = this.errorUtil.getError(err, {getValidationErrors: true});
                    if (typeof error === 'object') { return of(error); }
                    this.alertifyService.error(error || 'Authentication Failed.');
                    return of(null);
                })
            );
    }

    getCurrentUser(): User {
        console.log('getCurrentUser is called', this.currentUserSubject.value);
        return this.currentUserSubject.value;
    }

    passwordReset(
        password: string,
        newPassword: string
    ): Observable<{ success: true }> {
        return this.apiService
            .put('/user/password-reset', {
                password,
                newPassword
            }, null, true)
            .pipe(
                map(resp => {
                    if (!resp.success) {
                        this.alertifyService.error(this.errorUtil.getError(resp) || 'Failed to reset password.');
                        return of(null);
                    }
                    return resp;
                }),
                catchError(err => {
                    const error = this.errorUtil.getError(err, {getValidationErrors: true});
                    if (typeof error === 'object') { return of(error); }
                    this.alertifyService.error(error || 'Failed to reset password.');
                    return of(null);
                })
            );
    }

    // Update the user on the server (email, pass, etc)
    update(user): Observable<User> {
        return this.apiService
            .put('/user', { user })
            .pipe(
                map(data => {
                    if (!data.success) {
                        this.alertifyService.error(this.errorUtil.getError(data) || 'Failed to update user info');
                        return of(null);
                    }
                    // Update the currentUser observable
                    this.currentUserSubject.next(data.user);
                    return data.user;
                }),
                catchError(err => {
                    const error = this.errorUtil.getError(err, {getValidationErrors: true});
                    if (typeof error === 'object') { return of(error); }
                    this.alertifyService.error(error || 'Failed to update user info.');
                    return of(null);
                })
            );
    }
    updateProfile(
        image?: File,
        body: Object = {},
        userId?: string
    ) {
        const fd = new FormData();
        if (image) {
            fd.append('avatar', image, image.name);
        }
        for (const key of Object.keys(body)) {
            const b = typeof body[key] === 'object' ? JSON.stringify(body[key]) : body[key];
            fd.append(key, b);
        }
        if (userId) {
            return this.apiService.putWithProg(`/user/${userId}/profile`, fd);
        } else {
            return this.apiService.putWithProg('/user/profile', fd);
        }
    }

    fbAuth(cred): Observable<any> {
        console.log('fbAuth', cred);
        return this.apiService.post(
            '/users/facebook/token',
            { 'access_token': cred.authResponse.accessToken }
        ).pipe(
            map((data) => {
                if (!data.success) {
                    this.alertifyService.error(this.errorUtil.getError(data) || 'Login failed.');
                    return of(null);
                }
                data.user.token = data.token;
                this.setAuth(data.user);
                return data;
            }),
            catchError(err => {
                const error = this.errorUtil.getError(err, {getValidationErrors: true});
                if (typeof error === 'object') {
                    return of(error);
                }
                this.alertifyService.error(error || 'Login failed.');
                return of(null);
            })
        );
    }
    async fbLogin() {
        try {
            return await (() => {
                return new Promise((resolve, reject) => {
                    FB.login(result => {
                        if (result.authResponse) {
                            resolve(result);
                        } else {
                            reject();
                        }
                    }, { scope: 'public_profile,email' });
                });
            })();
        } catch (e) {
            return e;
        }
    }
    findUserReviews(
        filter = '',
        sortDirection = 'desc',
        sortField = 'rating',
        pageNumber: number = 1,
        pageSize: number = 10
    ): Observable<Review[]> {
        this.loadingSubject.next(true);
        return this.apiService.get(
            `/user/reviews`,
            new HttpParams()
                .set('filter', filter)
                .set('sortDirection', sortDirection)
                .set('sortField', sortField)
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
        ).pipe(
            map((res) => {
                if (!res.success) {
                    this.alertifyService.error(this.errorUtil.getError(res) || 'Failed to load user reviews.');
                    return of([]);
                }
                this.loadingSubject.next(false);
                return res['data'];
            }),
            catchError(err => {
                this.loadingSubject.next(false);
                const error = this.errorUtil.getError(err, {getValidationErrors: true});
                if (typeof error === 'object') { return of(error); }
                this.alertifyService.error(error || 'Failed to load user reviews.');
                return of([]);
            })
        );
    }
    findUserById(userId: string): Observable<User> {
        return this.apiService.get(`/users/${userId}`)
            .pipe(
                map((res) => {
                    if (!res.success) {
                        this.alertifyService.error(this.errorUtil.getError(res) || 'Something went wrong while retrieving user info');
                        return of(null);
                    }
                    return res.data;
                }),
                catchError(err => {
                    const error = this.errorUtil.getError(err, {getValidationErrors: true});
                    if (typeof error === 'object') { return of(error); }
                    this.alertifyService.error(error || 'Something went wrong while retrieving user info');
                    return of(null);
                })
            );
    }
    deleteReview(entityId: string): Observable<boolean> {
        return this.apiService.delete(`/user/review/${entityId}`, true)
            .pipe(
                map(resp => {
                    if (!resp.success) {
                        this.alertifyService.error(this.errorUtil.getError(resp) || 'Failed to delete review.');
                        return of(null);
                    }
                    return resp;
                }),
                catchError(err => {
                    const error = this.errorUtil.getError(err, {getValidationErrors: true});
                    if (typeof error === 'object') { return of(error); }
                    this.alertifyService.error(error || 'Failed to delete review.');
                    return of(null);
                })
            );
    }
    search(Obj: Object) {
        const keywords: Observable<string> = Obj['keyword'],
            sortField = Obj['sortField'],
            sortDirection = Obj['sortDirection'],
            pageNum = Obj['pageNum'],
            pageSize = Obj['pageSize'];
        return keywords.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(keyword => {
                if (!keyword) {
                    console.log('keyword is empty');
                    return of([]);
                }
                return this.findUsers(
                    keyword,
                    null,
                    sortDirection,
                    sortField,
                    pageNum,
                    pageSize
                );
            })
        );
    }

    findUsers(
        filter: string, filterFields: object, sortDirection = 'asc', sortField = 'username',
        pageNumber = 0, pageSize = 25
    ): Observable<User[]> {
        this.searchingSubject.next(true);
        return this.apiService.get(
            '/users',
            new HttpParams()
                .set('filter', filter)
                .set('filterFields', JSON.stringify(filterFields))
                .set('sortDirection', sortDirection)
                .set('sortField', sortField)
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
        ).pipe(
            map((res) => {
                this.searchingSubject.next(false);
                if (!res.success) {
                    this.alertifyService.error(this.errorUtil.getError(res) || 'Something went wrong while searching users');
                    return of([]);
                }
                res['data'].push(res['count']); // used to display filter count on the table
                return res['data'];
            }),
            catchError(err => {
                this.searchingSubject.next(false);
                this.alertifyService.error(this.errorUtil.getError(err) || 'Something went wrong while searching users');
                return of([]);
            })
        );
    }
    checkUsernameNotTaken(username: string): Observable<boolean> {
        if (!username) { return of(false); }
        return this.apiService.get(`/users/checkusername`, new HttpParams().set('username', username))
        .pipe(
            map(res => {
                if (!res.success) {
                    this.alertifyService.error(this.errorUtil.getError(res) || 'Failed to check username');
                    return of(null);
                }
                return res.data;
            }),
            catchError(err => {
                this.alertifyService.error(this.errorUtil.getError(err) || 'Failed to check username');
                return of(null);
            })
        );
    }
}
