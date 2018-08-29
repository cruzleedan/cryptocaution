import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { PageEvent, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { UserService, AlertifyService, User } from '../../../../core';
import { Review } from '../../../../core/models/review.model';
import { FormControl } from '@angular/forms';
import { MsgDialogComponent } from '../../../../shared/dialog/msg-dialog.component';
import { ActivatedRoute, Params } from '@angular/router';
import { mergeMap, map } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
    private userSubject = new BehaviorSubject<any>({});
    public user$ = this.userSubject.asObservable();

    loading = false;
    userReviews: Review[];
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
        private alertifyService: AlertifyService,
        private dialog: MatDialog,
        private route: ActivatedRoute
    ) {
        this.searchControl = new FormControl('');
        this.userService.loading$.subscribe(isLoading => {
            this.loading = isLoading;
        });
        const userSnapshot = this.route.snapshot.data['user'];
        if (userSnapshot) {
            console.log('snapshot', userSnapshot);
            this.user = userSnapshot;
            userSnapshot['userId'] = userSnapshot.id;
            this.userSubject.next(userSnapshot);
            this.userId = userSnapshot.id;
            this.loadUserReviews();
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
        this.loadUserReviews();
    }
    pageChange(event?: PageEvent) {
        console.log('event', event);
        this.loadUserReviews();
    }
    loadUserReviews(
        sort: string = 'desc',
        sortField: string = 'createdAt'
    ) {
        this.userService.findUserReviews(
            this.searchControl.value, // filter = '',
            sort, // sortDirection = 'desc',
            sortField, // sortField = 'rating',
            this.paginator && this.paginator.pageIndex ? this.paginator.pageIndex : 0, // pageNumber: number = 1,
            this.paginator && this.paginator.pageSize ? this.paginator.pageSize : 10,  // pageSize: number = 10,
            this.userId
        )
            .subscribe(reviews => {
                this.userReviews = reviews;
            });
    }
    onDelete(entityId: string) {
        const dialogRef = this.dialog.open(MsgDialogComponent, {
            data: {
                type: 'confirm',
                msg: 'Are you sure, you want to delete this review?'
            },
            width: '500px',
            hasBackdrop: true,
            panelClass: ''
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.proceed) {
                console.log('Will be deleting entity review', entityId);

                this.userService.deleteReview(entityId)
                    .subscribe(del => {
                        console.log('del', del);
                        if (del) {
                            this.alertifyService.success('Successfully deleted review');
                        }
                    });
            }
        });


    }
}
