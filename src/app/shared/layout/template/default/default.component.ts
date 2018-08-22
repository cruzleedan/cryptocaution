import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

@Component({
    selector: 'app-default-template',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, OnChanges {
    @Input() isVisible = true;
    visibility = 'shown';

    sideNavOpened = true;
    matDrawerOpened = false;
    matDrawerShow = true;
    sideNavMode = 'side';

    menus = [
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
            'icon': 'apps',
            'link': '/admin/categories',
            'open': false,
        }
    ];
    ngOnChanges() {
        this.visibility = this.isVisible ? 'shown' : 'hidden';
    }

    constructor(private media: ObservableMedia) { }

    ngOnInit() {
        this.media.subscribe((mediaChange: MediaChange) => {
            this.toggleView();
        });
    }
    getRouteAnimation(outlet) {

        return outlet.activatedRouteData.animation;
        // return outlet.isActivated ? outlet.activatedRoute : ''
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
        }
    }

}
