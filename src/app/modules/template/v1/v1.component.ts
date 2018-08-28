import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { CategoryService, UserService } from '../../../core';
import {
    PerfectScrollbarConfigInterface,
    PerfectScrollbarComponent,
    PerfectScrollbarDirective
} from 'ngx-perfect-scrollbar';

@Component({
    selector: 'app-v1-template',
    templateUrl: './v1.component.html',
    styleUrls: ['./v1.component.scss']
})
export class V1Component implements OnInit, AfterViewInit, OnChanges {
    @Input() isVisible = true;
    visibility = 'shown';

    sideNavOpened = true;
    matDrawerOpened = false;
    matDrawerShow = true;
    sideNavMode = 'side';
    searchOpen = true;

    isAdmin: boolean;
    menus: {
        'name': string,
        'icon'?: string,
        'link': string | boolean,
        'open': string | boolean,
        'sub'?: any,
        'chip'?: any,
        'tooltip'?: any
    }[] = [
            {
                'name': 'Home',
                'icon': 'home',
                'link': '/',
                'open': false
            }
        ];
    constructor(
        private media: ObservableMedia,
        private categoryService: CategoryService,
        private userService: UserService,
    ) {
        this.userService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
            if (this.isAdmin) {
                this.setAdminMenus();
            }
        });

        this.categoryService.categories$.subscribe(categories => {
            categories = categories.map(category => {
                category['tooltip'] = category['name'];
                return category;
            });
            this.addCategoriesToMenu(categories);
        });
    }
    ngOnInit() {
        this.media.subscribe((mediaChange: MediaChange) => {
            this.toggleView();
        });

        this.categoryService.getCategories().subscribe(categories => {
            categories = categories.map(category => {
                category['tooltip'] = category['name'];
                return category;
            });
            this.addCategoriesToMenu(categories);
        });
    }
    ngAfterViewInit() {
    }
    ngOnChanges() {
        this.visibility = this.isVisible ? 'shown' : 'hidden';
    }
    setAdminMenus() {
        this.menus = [
            {
                'name': 'Dashboards',
                'icon': 'dashboard',
                'link': false,
                'open': false,
                'tooltip': 'Dashboards',
                'chip': { 'value': 2, 'color': 'accent' },
                'sub': [
                    {
                        'name': 'Admin',
                        'link': '/admin',
                        'icon': 'dashboard',
                        'chip': false,
                        'tooltip': 'Admin Dashboard',
                        'open': true,
                    },
                    {
                        'name': 'User',
                        'link': '/',
                        'icon': 'dashboard',
                        'tooltip': 'User Dashboard',
                        'chip': false,
                        'open': true,
                    },
                ]
            },
            {
                'name': 'Manage',
                'icon': 'work',
                'tooltip': 'Manage',
                'link': false,
                'open': false,
                'sub': [
                    {
                        'name': 'Users',
                        'icon': 'people',
                        'tooltip': 'Manage Users',
                        'link': '/admin/users',
                        'open': false,
                    },
                    {
                        'name': 'Entities',
                        'icon': 'list',
                        'tooltip': 'Manage Entities',
                        'link': '/category',
                        'open': false,
                    },
                    {
                        'name': 'Categories',
                        'icon': 'view_modules',
                        'tooltip': 'Manage Categories',
                        'link': '/admin/categories',
                        'open': false,
                    }
                ]
            }
        ];
    }
    getRouteAnimation(outlet) {

        return outlet.activatedRouteData.animation;
        // return outlet.isActivated ? outlet.activatedRoute : ''
    }
    addCategoriesToMenu(category) {
        let categMenu = this.menus.filter(menu => {
            return menu.name === 'Categories';
        }).shift();
        if (!categMenu) {
            this.menus.push({
                'name': 'Categories',
                'icon': 'apps',
                'tooltip': 'Categories',
                'link': false,
                'open': true,
                'sub': category
            });
            categMenu = this.menus[this.menus.length - 1];
        }
        if (categMenu) {
            categMenu.sub = [
                {
                    'name': 'All',
                    'icon': 'view_module',
                    'tooltip': 'All Categories',
                    'link': '/category',
                    'open': true,
                },
                ...category
            ];
        }
    }
    toggleView() {
        if (this.media.isActive('gt-md')) {
            this.sideNavMode = 'side';
            this.sideNavOpened = true;
            this.matDrawerOpened = false;
            this.matDrawerShow = true;
        } else if (this.media.isActive('gt-xs')) {
            this.sideNavMode = 'side';
            this.sideNavOpened = false;
            this.matDrawerOpened = true;
            this.matDrawerShow = true;
        } else if (this.media.isActive('lt-sm')) {
            this.sideNavMode = 'over';
            this.sideNavOpened = false;
            this.matDrawerOpened = false;
            this.matDrawerShow = false;
            this.searchOpen = false;
        }
        if (this.media.isActive('gt-sm') || this.media.isActive('sm')) {
            this.searchOpen = true;
        }
    }

}
