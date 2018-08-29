import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { PageEvent, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { UserService, AlertifyService, User, EntityService } from '../../../../core';
import { Review } from '../../../../core/models/review.model';
import { FormControl } from '@angular/forms';
import { MsgDialogComponent } from '../../../../shared/dialog/msg-dialog.component';
import { Entity } from '../../../../core/models/entity.model';
import { ActivatedRoute, Params } from '@angular/router';
import { mergeMap, map } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-entities',
    templateUrl: './entities.component.html',
    styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
    private userSubject = new BehaviorSubject<any>({});
    public user$ = this.userSubject.asObservable();

    loading = false;
    userEntities: Entity[];
    user: User;
    userId: string;
    searchControl: FormControl;
    baseUrl = environment.baseUrl;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('input', {
        read: ElementRef
    }) myInput: ElementRef;
    constructor(
        private userService: UserService,
        private entityService: EntityService,
        private route: ActivatedRoute
    ) {
        this.searchControl = new FormControl('');
        const userSnapshot = this.route.snapshot.data['user'];
        if (userSnapshot) {
            console.log('snapshot', userSnapshot);
            this.user = userSnapshot;
            userSnapshot['userId'] = userSnapshot.id;
            this.userSubject.next(userSnapshot);
            this.userId = userSnapshot.id;
            this.loadUserEntities();
        }
    }

    ngOnInit() {
        if (!this.route.snapshot.data['user']) {
            this.route.params
                .pipe(
                    map(params => {
                        this.userId = params['userId'];
                        this.getUser(params['userId']);
                        return params['userId'];
                    })
                )
                .subscribe((userId: string) => {
                });
        }
    }
    getUser(userId?: string) {
        userId = !userId && this.route.snapshot.data['user'] ? this.route.snapshot.data['user'].id : '';
        console.log('getUser', userId);
        if (userId) {
            this.userService.findUserById(userId)
                .subscribe(user => {
                    this.user = user;
                    user['userId'] = this.userId;
                    this.userSubject.next(user);
                });
        } else {
            this.userService.currentUser
                .subscribe(user => {
                    this.user = user;
                    this.userSubject.next(user);
                });
        }
        this.loadUserEntities();
    }
    pageChange(event?: PageEvent) {
        console.log('event', event);
        this.loadUserEntities();
    }
    loadUserEntities(
        sort: string = 'desc',
        sortField: string = 'createdAt'
    ) {
        this.userService.findUserEntities(
            this.searchControl.value, // filter = '',
            sort, // sortDirection = 'desc',
            sortField, // sortField = 'rating',
            this.paginator && this.paginator.pageIndex ? this.paginator.pageIndex : 0, // pageNumber: number = 1,
            this.paginator && this.paginator.pageSize ? this.paginator.pageSize : 10,  // pageSize: number = 10
            this.userId
        )
            .subscribe(entities => {
                this.userEntities = entities;
            });
    }
}
