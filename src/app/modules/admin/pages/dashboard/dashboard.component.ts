import { Component, OnInit } from '@angular/core';
import { UserService, EntityService, CategoryService, ReviewService } from '../../../../core';
import { finalize } from 'rxjs/operators';
import { User } from '../../../../../app/core/models/user.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    private userCard = { colorDark: '#42A5F5', colorLight: '#64B5F6', number: 0, title: 'USERS', icon: 'person' };
    private entityCard = { colorDark: '#5C6BC0', colorLight: '#7986CB', number: 0, title: 'ENTITIES', icon: 'assignments' };
    private reviewCard = { colorDark: '#26A69A', colorLight: '#4DB6AC', number: 0, title: 'REVIEWS', icon: 'star' };
    private categoryCard = { colorDark: '#66BB6A', colorLight: '#81C784', number: 0, title: 'CATEGORIES', icon: 'new_releases' };
    dashCard = [
        this.userCard,
        this.entityCard,
        this.reviewCard,
        this.categoryCard
    ];

    tableData = [
        { country: 'India', sales: 5400, percentage: '40%' },
        { country: 'Us', sales: 3200, percentage: '30.33%' },
        { country: 'Australia', sales: 2233, percentage: '18.056%' },
        { country: 'Spaim', sales: 600, percentage: '6%' },
        { country: 'China', sales: 200, percentage: '4.50%' },
        { country: 'Brazil', sales: 100, percentage: '2.50%' },
    ];

    constructor(
        private userService: UserService,
        private entityService: EntityService,
        private categoryService: CategoryService,
        private reviewService: ReviewService
    ) {
        userService.findUsers().subscribe();
        userService.usersCount$.subscribe(count => {
            this.userCard.number = count;
        });

        entityService.findEntities().subscribe();
        entityService.entitiesCount$.subscribe(count => {
            this.entityCard.number = count;
        });

        categoryService.findCategories().subscribe();
        categoryService.categoriesCount$.subscribe(count => {
            this.categoryCard.number = count;
        });

        reviewService.findReviews().subscribe();
        reviewService.reviewsCount$.subscribe(count => {
            this.reviewCard.number = count;
        });
    }

    ngOnInit() {
    }
}
