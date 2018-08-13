import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../../core';

@Component({
    selector: 'app-mng-categories',
    templateUrl: './mng-categories.component.html',
    styleUrls: ['./mng-categories.component.scss']
})
export class MngCategoriesComponent implements OnInit {
    isEdit: boolean;
    category: Category;
    constructor(
        private route: ActivatedRoute
    ) {
        this.route.params.subscribe(param => {
            this.category = this.route.snapshot.data.category;
            console.log('edit category', this.category);
            this.isEdit = !!(param.id);
        });
    }

    ngOnInit() {
    }

}
