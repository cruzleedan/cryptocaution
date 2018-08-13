import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, EntityListConfig, CategoryService, CategoryMenu, EntityService } from '../../../core';
import { map } from 'rxjs/operators';
import { Entity } from '../../../core/models/entity.model';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    baseUrl = environment.baseUrl;
    services = [{
        img: 'https://www.bitcoinforbeginners.io/wp-content/uploads/2018/01/getting_started.jpg?x63937',
        title: 'Guides & FAQ',
        desc: 'How-to tutorials and guides to help you get started with cryptocurrency investing. Clear, concise, and written for beginners without a technical background.',
        link: 'https://www.bitcoinforbeginners.io/cryptocurrency-guides-tutorials/'
    }, {
        img: 'https://www.bitcoinforbeginners.io/wp-content/uploads/2018/01/crypto_news.jpg?x63937',
        title: 'Crypto News',
        desc: 'Daily digest of the top cryptocurrency news articles with a short summary for each one. Also includes weekly market analysis articles and the most up-to-date information.',
        link: 'https://www.bitcoinforbeginners.io/cryptocurrency-news-today/'
    }, {
        img: 'https://www.bitcoinforbeginners.io/wp-content/uploads/2018/01/coin_ico_review.jpg?x63937',
        title: 'Coins and ICOs',
        desc: 'Overview articles of the latest and greatest coins and ICOs. Serves as an introduction and presents only facts – does not include any recommendations to buy/sell.',
        link: 'https://www.bitcoinforbeginners.io/cryptocurrency-reviews/'
    }];
    constructor(
        private router: Router,
        private categoriesService: CategoryService,
        private userService: UserService,
        private entityService: EntityService
    ) { }

    isAuthenticated: boolean;
    listConfig: EntityListConfig = {
        type: 'all',
        filters: {}
    };
    categories: CategoryMenu[] = [];
    categoriesLoaded: Boolean = false;
    topEntities: Entity[];
    recentEntities: Entity[];
    trendingEntities: Entity[];

    ngOnInit() {
        this.userService.isAuthenticated.subscribe(
            (authenticated) => {
                this.isAuthenticated = authenticated;
                // set the dashboard list accordingly
                if (authenticated) {
                    this.setListTo('feed');
                } else {
                    this.setListTo('all');
                }
            }
        );
        this.categoriesService.getCategories()
            .subscribe(categories => {
                this.categories = categories;
                this.categoriesLoaded = true;
            });
        this.entityService.getEntities('rating', '0', '5')
            .subscribe(entities => {
                this.topEntities = entities;
            });
        this.entityService.getEntities('reviewCount', '0', '5')
            .subscribe(entities => {
                this.trendingEntities = entities;
            });
        this.entityService.getEntities('createdAt', '0', '5')
            .subscribe(entities => {
                this.recentEntities = entities;
            });
    }

    setListTo(type: string = '', filters: Object = {}) {
        // If feed is requested but user is not authenticated, redirect to login
        if (type === 'feed' && !this.isAuthenticated) {
            this.router.navigateByUrl('/login');
            return;
        }

        // Otherwise, set the list object
        this.listConfig = { type: type, filters: filters };
    }
}
