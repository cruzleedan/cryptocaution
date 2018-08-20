import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { EntityService, CategoryService, CategoryMenu } from '../../core';
import { Router } from '@angular/router';
import { Entity } from '../../core/models/entity.model';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-nav-search-bar',
    templateUrl: './nav-search-bar.component.html',
    styleUrls: ['./nav-search-bar.component.scss']
})
export class NavSearchBarComponent implements OnInit {

    public bigMenu;
    @Input() open;
    loading = false;
    searchFormControl = new FormControl();
    searchKeyword: String = '';
    filteredOptions: Entity[];
    categoryOptions: CategoryMenu[];
    searchKeyword$ = new Subject<string>();
    constructor(
        private router: Router,
        private entityService: EntityService,
        private categoryService: CategoryService
    ) {
        this.categoryService.getCategories().pipe(take(1)).subscribe();
        this.categoryService.categories$.subscribe(categories => {
            this.categoryOptions = categories;
        });
        this.entityService.search({
            keyword: this.searchKeyword$,
            sortField: 'entity_name',
            sortDirection: 'asc',
            pageNum: 0,
            pageSize: 5
        })
            .subscribe(
                res => {
                    this.filteredOptions = res;
                }
            );
        this.entityService.searching$.subscribe(loading => {
            setTimeout(() => {
                this.loading = loading;
            }, 0);
        });
    }
    ngOnInit() {
    }

    search(event: MatAutocompleteSelectedEvent) {
        const entityId: number = event.option.value ? event.option.value['entity_id'] : '';
        if (entityId) {
            this.router.navigateByUrl('/entity/' + entityId);
        }
    }
    clearSearch() {
        this.searchFormControl.setValue('');
        this.searchKeyword$.next('');
    }
    searchDisplayFn(value: any) {
        return value && value.hasOwnProperty('entity_name') ? value['entity_name'] : '';
    }
    findKeyword() {
        this.router.navigate(['/category'], {
            queryParams: { 'find': this.searchFormControl.value }
        });
    }
}
