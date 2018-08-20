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
    loadingTop = true;
    loadingTrending = true;
    loadingRecent = true;
    ngOnInit() {
        this.categoriesService.getCategories()
            .subscribe(categories => {
                this.categories = categories;
                this.categoriesLoaded = true;
            });
        this.entityService.getEntities('rating', '0', '5')
            .subscribe(entities => {
                this.loadingTop = false;
                this.topEntities = entities;
            });
        this.entityService.getEntities('reviewCount', '0', '5')
            .subscribe(entities => {
                this.loadingTrending = false;
                this.trendingEntities = entities;
            });
        this.entityService.getEntities('createdAt', '0', '5')
            .subscribe(entities => {
                this.loadingRecent = false;
                this.recentEntities = entities;
            });
    }
}
