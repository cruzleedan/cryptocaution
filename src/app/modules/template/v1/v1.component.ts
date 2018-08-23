import { Component, OnInit, Input, OnChanges, APP_INITIALIZER } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { CategoryService, UserService } from '../../../core';

@Component({
    selector: 'app-v1-template',
    templateUrl: './v1.component.html',
    styleUrls: ['./v1.component.scss']
})
export class V1Component implements OnInit, OnChanges {
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
        private userService: UserService
    ) {
        this.userService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
            if (this.isAdmin) {
                this.setAdminMenus();
            }
        });
        this.categoryService.getCategories().subscribe(category => {
            this.addCategoriesToMenu(category);
        });
    }
    ngOnChanges() {
        this.visibility = this.isVisible ? 'shown' : 'hidden';
    }


    ngOnInit() {
        this.media.subscribe((mediaChange: MediaChange) => {
            this.toggleView();
        });
    }
    setAdminMenus() {
        this.menus = [
            {
                'name': 'Dashboards',
                'icon': 'dashboard',
                'link': false,
                'open': false,
                'chip': { 'value': 2, 'color': 'accent' },
                'sub': [
                    {
                        'name': 'Admin',
                        'link': '/admin',
                        'icon': 'dashboard',
                        'chip': false,
                        'open': true,
                    },
                    {
                        'name': 'User',
                        'link': '/',
                        'icon': 'dashboard',
                        'chip': false,
                        'open': true,
                    },
                ]
            },
            {
                'name': 'Manage',
                'icon': 'work',
                'link': false,
                'open': false,
                'sub': [
                    {
                        'name': 'Manage Users',
                        'icon': 'people',
                        'link': '/admin/users',
                        'open': false,
                    },
                    {
                        'name': 'Manage Entities',
                        'icon': 'list',
                        'link': '/category',
                        'open': false,
                    },
                    {
                        'name': 'Manage Categories',
                        'icon': 'view_modules',
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
