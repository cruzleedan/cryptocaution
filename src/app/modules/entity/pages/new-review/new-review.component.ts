import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HoverRatingChangeEvent } from 'angular-star-rating';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService, EntityService } from '../../../../core';
import { MatDialog, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { MsgDialogComponent } from '../../../../shared/dialog/msg-dialog.component';
import { ReviewService } from '../../../../core/services/review.service';
import { Review } from '../../../../core/models/review.model';
import { finalize, map, mergeMap } from 'rxjs/operators';
import { Entity } from '../../../../core/models/entity.model';
import { of } from 'rxjs';
@Component({
    selector: 'app-new-review',
    templateUrl: './new-review.component.html',
    styleUrls: ['./new-review.component.scss']
})
export class NewReviewComponent implements OnInit {
    isEdit: boolean;
    loading: boolean;
    hasUserAcceptedTerms: boolean;
    acceptedTerms: boolean;
    reviewForm: FormGroup;
    ratingLabel: string;
    isAuthenticated: boolean;
    entityId: string;
    entityName: string;
    termsError: string;
    matcher;
    review: Review;
    entity: Entity;
    private _labels = [
        '1 star: Bad – unacceptable experience, unreasonable and rude conduct.',
        '2 stars: Poor – an inadequate experience with a lot of friction.',
        '3 stars: Average – acceptable experience but with some friction.',
        '4 stars: Great – decent treatment and very little friction.',
        '5 stars: Excellent – no reservations, I would recommend this company to anyone.'
    ];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private userService: UserService,
        private reviewService: ReviewService,
        private entityService: EntityService,
        private dialog: MatDialog,
    ) {
        this.isEdit = this.router.url.split('/').pop() === 'edit' ? true : false;
        this.entityId = this.route.snapshot.params['id'];
        this.review = this.route.snapshot.data.review || {};

        this.entityService.findEntityById(this.entityId)
            .subscribe(data => {
                if (data) {
                    this.entity = data;
                }
            });

        this.matcher = new ShowOnDirtyErrorStateMatcher;
        this.reviewForm = this.fb.group({
            rating: new FormControl('', [
                Validators.required,
                Validators.min(1)
            ]),
            review: new FormControl('', [
                Validators.required
            ]),
            title: new FormControl('')
        });
        this.userService.isAuthenticated.subscribe(
            (authenticated) => {
                this.isAuthenticated = authenticated;
                this.hasUserAcceptedTerms = this.userService.getCurrentUser().AcceptedTermsFlag;
            }
        );
    }

    ngOnInit() {
        this.reviewForm.patchValue(this.review);
        this.reviewForm.markAsPristine();
        this.entityName = this.review.hasOwnProperty('Entity')
            && this.review['Entity'].hasOwnProperty('name') ? this.review['Entity']['name'] : '';
        this.route.params.subscribe(params => {
            this.entityId = params['id'];
        });
        this.route.queryParams
            .subscribe(params => {
                if (params && params.rating) {
                    this.reviewForm.get('rating').setValue(params.rating);
                }
            });
        this.reviewForm.get('review').valueChanges.subscribe((value) => {
            const title = value.split('\n')[0];
            this.reviewForm.get('title').setValue(title);
        });
        this.reviewForm.get('rating').valueChanges.subscribe(value => {
            this.ratingLabel = value > 0 ? this._labels[value - 1] : '';
        });
    }
    onHoverRatingChange(event: HoverRatingChangeEvent) {
        const rate = event.hoverRating;
        this.ratingLabel = rate > 0 ? this._labels[rate - 1] : '';
        if (rate > 0) {
            this.ratingLabel = this._labels[rate - 1];
        } else if (rate === 0 && this.reviewForm.get('rating').value > 0) {
            this.ratingLabel = this._labels[this.reviewForm.get('rating').value - 1];
        }
    }
    resetForm() {
        this.reviewForm.reset({ 'rating': 0, 'review': '' });
        if (Object.keys(this.review)) {
            this.reviewForm.patchValue(this.review);
            this.reviewForm.markAsPristine();
        }
    }
    submitReview() {
        if (this.reviewForm.valid && (this.hasUserAcceptedTerms || this.acceptedTerms)) {
            const addReview = () => {
                this.loading = true;
                this.reviewService
                    .addReview(this.entityId, this.reviewForm.value)
                    .pipe(
                        mergeMap(resp => {
                            this.userService.populate();
                            return of(resp);
                        })
                    )
                    .subscribe((resp) => {
                        this.loading = false;
                        console.log('New Review', resp);
                        this.router.navigate([`/entity/${this.entityId}`]);
                    });
            };

            if (!this.hasUserAcceptedTerms && this.acceptedTerms) {
                console.log('SHOULD CALL USER UPDATE');

                const user = this.userService.getCurrentUser();
                user.AcceptedTermsFlag = true;
                this.loading = true;
                this.userService.update(user).subscribe((updatedUser) => {
                    this.loading = false;
                    if (updatedUser && updatedUser.AcceptedTermsFlag) {
                        addReview();
                    }
                });
            } else {
                addReview();
            }
        } else if (!this.hasUserAcceptedTerms && !this.acceptedTerms) {
            this.termsError = 'Please accept terms and conditions below.';
        } else {
            this.dialog.open(MsgDialogComponent, {
                data: {
                    msg: 'Invalid Form',
                    type: 'error',
                    title: 'Error'
                },
                width: '300px',
                hasBackdrop: true,
                panelClass: 'error'
            });
        }
    }
    onAcceptTerms(val) {
        console.log('val', val);

        this.termsError = val ? '' : this.termsError;
    }
    getUserReview() {
        this.loading = true;
        this.reviewService.hasUserReviewedEntity(this.entityId)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(review => {
                if (review) {
                    this.review = review;
                }
            });
    }
    logIn() {
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
                this.getUserReview();
            }
        });
    }
    fbLogin() {
        this.userService.fbLogin()
            .then((cred) => {
                console.log('fblogin ', cred);
                this.userService.fbAuth(cred).subscribe((resp) => {
                    if (resp.success) {
                        this.getUserReview();
                    } else {
                        console.log('Unsuccessful login');
                        const dialogRef = this.dialog.open(MsgDialogComponent, {
                            data: {
                                msg: 'Login failed. Please try again.',
                                type: 'error',
                                title: 'Error',
                                details: false,
                            },
                            width: '300px',
                            hasBackdrop: true,
                            panelClass: 'error'
                        });
                    }
                });
            }).catch((err) => {
                const dialogRef = this.dialog.open(MsgDialogComponent, {
                    data: {
                        msg: 'Something went wrong while logging you in',
                        type: 'error',
                        title: 'Error',
                        details: err,
                    },
                    width: '300px',
                    hasBackdrop: true,
                    panelClass: 'error'
                });
            });
    }
}
