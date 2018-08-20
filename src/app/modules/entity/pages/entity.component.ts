import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Entity } from '../../../core/models/entity.model';
import { MatPaginator, MatSort, PageEvent, MatDialog, MatSelectChange } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EntityService, ReviewService, AlertifyService, User, UserService } from '../../../core';
import { ReviewsDataSource } from '../../../core/datasources/reviews.datasource';
import { Review } from '../../../core/models/review.model';
import { environment } from '../../../../environments/environment';
import { HoverRatingChangeEvent, RatingChangeEvent } from 'angular-star-rating';
import { DomSanitizer } from '@angular/platform-browser';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MsgDialogComponent } from '../../../shared/dialog/msg-dialog.component';

@Component({
    selector: 'app-entity',
    templateUrl: './entity.component.html',
    styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {
    baseUrl = environment.baseUrl;
    isAdmin: boolean;
    loading: boolean;
    image: any;
    rated: boolean;
    entity: Entity;
    entityTotalReviews: number;
    entityReviews: Review[];
    pageEvent: PageEvent;
    entityRating: string;
    entityDesc: any;
    currentUser: User;
    sortField: string;
    sortDirect = 'desc';
    filter: string | object = '';
    // reviewsDataSource: ReviewsDataSource;
    columnsToDisplay = ['review_id'];
    private _ratings = ['Bad', 'Poor', 'Average', 'Great', 'Excellent'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('input', {
        read: ElementRef
    }) myInput: ElementRef;

    constructor(private entityService: EntityService,
        private reviewService: ReviewService,
        private router: Router,
        private domSanitizer: DomSanitizer,
        private dialog: MatDialog,
        private alertifyService: AlertifyService,
        private userService: UserService,
        private route: ActivatedRoute) {
            this.userService.currentUser.subscribe(userData => {
                this.currentUser = userData;
            });
        }

    ngOnInit() {
        this.formatFields();
        this.route.params
            .subscribe(
                (params: Params) => {
                    this.formatFields();
                    this.entity['id'] = params['id'];
                    this.loadReviews();
                }
            );
        this.userService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });
    }
    formatFields() {
        this.entity = this.route.snapshot.data['entity'];
        this.entityDesc = this.domSanitizer.bypassSecurityTrustHtml(this.entity.desc);
        this.entity.links = this.entity.links instanceof Array ? this.entity.links : [];
        if (this.entity.rating === null || isNaN(this.entity.rating) || this.entity.rating <= 0) {
            this.entityRating = '';
            this.rated = false;
        } else {
            const indx = Math.floor(this.entity.rating) - 1;
            this.entityRating = this._ratings[indx];
            this.rated = true;
        }
    }
    pageChange(event?: PageEvent) {
        console.log('event', event);
        this.loadReviews();
    }
    loadReviews(
        sort: string = 'desc',
        sortField: string = 'createdAt',
        filter?: string | object
    ) {
        this.loading = true;
        this.entityService.findReviews(
            this.entity['id'], // entityId: number,
            filter || this.myInput.nativeElement.querySelector('input').value, // filter = '',
            sort, // sortDirection = 'desc',
            sortField, // sortField = 'rating',
            this.paginator.pageIndex, // pageNumber: number = 1,
            this.paginator.pageSize // pageSize: number = 10
        )
            .subscribe(resp => {
                this.loading = false;
                this.entityReviews = resp['data'];
                this.entityTotalReviews = resp['count'];
            });
    }
    onHoverRatingChange(event: HoverRatingChangeEvent) {
        // console.log('onHoverRatingChange', event);
    }
    onClick(event: RatingChangeEvent) {
        this.router.navigate([`/entity/${this.entity.id}/review/new`], {
            queryParams: { rating: event.rating }
        });
    }
    voteReview(reviewId, type) {
        this.reviewService.voteReview(reviewId, type)
            .subscribe(data => {
                if (data.error === 'Unauthorized') {
                    const dialogRef = this.dialog.open(MsgDialogComponent, {
                        data: {
                            isAuth: true
                        },
                        width: '500px',
                        hasBackdrop: true,
                        panelClass: ''
                    });
                    dialogRef.afterClosed().subscribe(resp => {
                        if (resp && resp.data && resp.data.success) {
                            console.log('User has been authenticated');
                            this.voteReview(reviewId, type);
                        }
                    });
                } else {
                    const foundIndex = this.entityReviews.findIndex(rev => rev.id === data.id);
                    if (foundIndex > -1) {
                        this.entityReviews[foundIndex] = Object.assign(this.entityReviews[foundIndex], data);
                    }
                }
            });
    }
    clearFilters() {
        this.filter = '';
        this.loadReviews('desc', 'createdAt', '');
    }
    filterStars(star: number) {
        this.filter = {rating: star};
        this.loadReviews('desc', 'createdAt', this.filter);
    }
    sortReviews(event: MatSelectChange) {
        const field = event.value;
        console.log('Sort Reviews', field);

        this.sortField = field;
        this.loadReviews('desc', field, this.filter);
    }
    sortDirection() {
        this.sortDirect = this.sortDirect === 'desc' ? 'asc' : 'desc';
        this.loadReviews(this.sortDirect, this.sortField, this.filter);
    }
    afterEntityDelete(del) {
        if (del.success) {
            this.router.navigate(['/categories']);
        }
    }
}
