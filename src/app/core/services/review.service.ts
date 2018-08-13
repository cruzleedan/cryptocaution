import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Review } from '../models/review.model';
import { AlertifyService } from './alertify.service';
import { Util } from '../errors/helpers/util';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    constructor(
        private apiService: ApiService,
        private alertifyService: AlertifyService,
        private userService: UserService,
        private errorUtil: Util
    ) { }
    hasUserReviewedEntity(entityId: string): Observable<Review> {
        if (!this.userService.getCurrentUser() || !Object.keys(this.userService.getCurrentUser()).length) {
            return of(null);
        }
        return this.apiService.get(`/user/review/${ entityId }`)
            .pipe(
                map(res => {
                    if (!res['success']) {
                        this.alertifyService.error(this.errorUtil.getError(res) || 'Failed to check if user reviewed Entity');
                        return of(null);
                    }
                    return res['data'];
                }),
                catchError(err => {
                    this.alertifyService.error(this.errorUtil.getError(err) || 'Failed to check if user reviewed Entity');
                    return of(null);
                })
            );
    }
    addReview(
        entityId: number,
        newEntity: Object = {}
    ) {
        return this.apiService.put(`/entities/${ entityId }/reviews/new`, newEntity )
            .pipe(
                map(res => {
                    if (!res['success']) {
                        this.alertifyService.error(this.errorUtil.getError(res) || 'Failed to add Review');
                        return of(null);
                    }
                    return res['data'];
                }),
                catchError(err => {
                    this.alertifyService.error(this.errorUtil.getError(err) || 'Failed to add Review');
                    return of(null);
                })
            );
    }
    voteReview(
        reviewId: number,
        voteType: boolean
    ) {
        return this.apiService.put(`/entities/reviews/${ reviewId }/vote`, {voteType}, null, true)
            .pipe(
                map(res => {
                    if (!res['success']) {
                        this.alertifyService.error(this.errorUtil.getError(res) || 'Something went wrong while saving your vote.');
                    }
                    return res['data'];
                }),
                catchError(err => {
                    this.alertifyService.error(this.errorUtil.getError(err) || 'Something went wrong while saving your vote.');
                    return of(null);
                })
            );
    }
}
