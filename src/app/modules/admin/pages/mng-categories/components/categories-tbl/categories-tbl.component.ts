import { Component, OnInit , ElementRef, ViewChild, AfterViewInit} from '@angular/core';

import { tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { UsersDataSource } from '../../../../../../core/datasources/users.datasource';
import { UserService, CategoryService } from '../../../../../../core';
import { environment } from '../../../../../../../environments/environment';
import { CategoriesDataSource } from '../../../../../../core/datasources/categories.datasource';
import { FormControl } from '@angular/forms';
import { Params } from '@angular/router';


@Component({
    selector: 'app-categories-tbl',
    templateUrl: './categories-tbl.component.html',
    styleUrls: ['./categories-tbl.component.scss']
})
export class CategoriesTblComponent implements OnInit, AfterViewInit {
    baseUrl = environment.baseUrl;
    showNavListCode;
    categoriesCount: number;
    searchFormControl = new FormControl();
    displayedColumns = ['select', 'icon', 'category', 'action'];
    selection = new SelectionModel<string>(true, []);
    dataSource: CategoriesDataSource;
    // allfeatures = TABLE_HELPERS;
    constructor(
        private categoryService: CategoryService
    ) {
        this.categoryService.categoriesCount$.subscribe(count => {
            this.categoriesCount = count;
        });
    }
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.dataSource = new CategoriesDataSource(this.categoryService);
        this.loadCategories();
        this.sort.sortChange.subscribe(sort => {
            this.loadCategories();
        });
        this.searchFormControl.valueChanges
            .pipe(
                debounceTime(250),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadCategories();
                })
            )
            .subscribe(
                (params: Params) => {
                    console.log('datasource ', this.dataSource);
                }
            );
        // observableFromEvent(this.filter.nativeElement, 'keyup').pipe(
        //     debounceTime(150),
        //     distinctUntilChanged(), )
        //     .subscribe(() => {
        //         if (!this.dataSource) { return; }
        //         this.dataSource.filter = this.filter.nativeElement.value;
        //     });
    }
    ngAfterViewInit() {
        this.paginator.page
            .pipe(
                tap(() => this.loadCategories())
            )
            .subscribe();
    }
    loadCategories() {
        let filter = this.filter.nativeElement.value || '';
        filter = {'category': filter};
        this.dataSource.loadCategories(
            filter,
            this.sort.direction,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize
        );
    }
    isAllSelected(): boolean {
        if (!this.dataSource) { return false; }

        if (this.selection.isEmpty()) { return false; }

        if (this.filter.nativeElement.value) {
            return this.selection.selected.length === this.dataSource.renderedData.length;
        } else {
            return this.selection.selected.length === this.dataSource.renderedData.length;
        }
    }

    masterToggle() {
        if (!this.dataSource) { return; }

        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            this.dataSource.renderedData.forEach(data => {
                console.log('select ', data.id);

                this.selection.select(data.id);
            });
            console.log('selection', this.selection);

        }
    }
}
