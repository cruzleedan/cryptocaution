import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ReviewService, User, UserService, EntityService } from '../../core';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { Review } from '../../core/models/review.model';
import { ActivatedRoute, Params } from '@angular/router';
import { PageEvent, MatPaginator, MatSelectChange } from '@angular/material';

@Component({
    selector: 'app-review-card',
    templateUrl: './review-card.component.html',
    styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent implements OnInit {
    @Input() entityId$;
    @Input() entityTotalReviews;
    baseUrl = environment.baseUrl;
    entityId: string;
    currentUser: User;
    isAdmin: boolean;
    loading: boolean;
    entityReviews: Review[];
    filter: string | object = '';
    sortField = 'createdAt';
    sortDirect = 'desc';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('input', {
        read: ElementRef
    }) myInput: ElementRef;

    constructor(
        private entityService: EntityService,
        private reviewService: ReviewService,
        private authService: AuthService,
        private userService: UserService,
        private route: ActivatedRoute
    ) {
        this.userService.currentUser.subscribe(userData => {
            this.currentUser = userData;
        });
    }

    ngOnInit() {
        this.entityId$
            .subscribe(entityId => {
                this.entityId = entityId;
                this.loadReviews();
            });
        this.userService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });
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
            this.entityId, // entityId: number,
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
    voteReview(reviewId, type) {

        this.reviewService.voteReview(reviewId, type)
            .subscribe(data => {
                if (data.error === 'Unauthorized') {
                    this.authService.showAuthFormPopup((resp) => {
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
}
