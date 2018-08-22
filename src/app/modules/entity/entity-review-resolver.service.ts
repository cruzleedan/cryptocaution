import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ReviewService, UserService } from '../../core';
import { Review } from '../../core/models/review.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EntityReviewResolver implements Resolve<Review> {

    constructor(
        private reviewService: ReviewService
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Review> {
        return this.reviewService.hasUserReviewedEntity(route.params['id'])
            .pipe(
                map(data => {
                    console.log('resolver log ', data);
                    return data;
                }),
                catchError(error => {
                    console.log('resolver error', error);
                    return of(null);
                })
            );
    }

}

