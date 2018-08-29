import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User, ReviewService } from '../../../../core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
    baseUrl = environment.baseUrl;
    review;
    user;
    entity;
    isAdmin: boolean;
    currentUser: User;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private reviewService: ReviewService,
        private authService: AuthService
    ) {
        this.review = this.route.snapshot.data['review'];
        this.userService.currentUser.subscribe(userData => {
            this.currentUser = userData;
        });
    }

    ngOnInit() {
        this.userService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });
        this.user = this.review && this.review.User ? this.review.User : {};
        this.entity = this.review && this.review.Entity ? this.review.Entity : {};
    }
    afterDeletion() {
        this.router.navigate([`/entity/${this.entity.id}`]);
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
                    this.entity = data;
                }
            });
    }
}
