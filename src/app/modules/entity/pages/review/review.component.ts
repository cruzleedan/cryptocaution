import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
    review;
    user;
    entity;
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.review = this.route.snapshot.data['review'];
        this.user = this.review && this.review.User ? this.review.User : {};
        this.entity = this.review && this.review.Entity ? this.review.Entity : {};
    }


}
