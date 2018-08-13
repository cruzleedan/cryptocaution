import { Component, Input, OnInit } from '@angular/core';
import { CategoryMenu, CategoryService } from '../../core';

@Component({
    selector: 'app-category-menu',
    templateUrl: './category-menu.component.html',
    styleUrls: ['./category-menu.component.scss']
})
export class CategoryMenuComponent implements OnInit {

    @Input() iconOnly = false;
    menus: CategoryMenu[];
    constructor(
        private categoryService: CategoryService
    ) {
        // Menu Template
        // this.menus = [
        //     {
        //         'id': 1,
        //         'name': 'Dashboard',
        //         'icon': 'dashboard',
        //         'link': false,
        //         'open': false,
        //         'chip': { 'value': 1, 'color': 'accent' },
        //         'sub': [
        //             {
        //                 'name': 'Dashboard',
        //                 'link': '/auth/dashboard',
        //                 'icon': 'dashboard',
        //                 'chip': false,
        //                 'open': true,
        //             }
        //         ]
        //     },
        //     {
        //         'id': 2,
        //         'name': 'Tables',
        //         'icon': 'list',
        //         'link': false,
        //         'open': false,
        //         'chip': { 'value': 2, 'color': 'accent' },
        //         'sub': [
        //             {
        //                 'name': 'Fixed',
        //                 'icon': 'filter_list',
        //                 'link': 'tables/fixed',
        //                 'open': false,
        //             },
        //             {
        //                 'name': 'Feature',
        //                 'icon': 'done_all',
        //                 'link': 'tables/featured',
        //                 'open': false,
        //             },
        //             {
        //                 'name': 'Responsive Tables',
        //                 'icon': 'filter_center_focus',
        //                 'link': 'tables/responsive',
        //                 'open': false,
        //             }
        //         ]
        //     }
        // ];
        this.categoryService.getCategories().subscribe(category => {
            this.menus = category;
        });
    }

    ngOnInit() {
    }

}
