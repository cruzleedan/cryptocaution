import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { EntityService, CategoryService, CategoryMenu } from '../../core';
import { Router } from '@angular/router';
import { Entity } from '../../core/models/entity.model';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, AfterViewInit {
    bigMenu: boolean;
    @Input() inputRef: ElementRef;
    @Input() class: string;
    @Input() spinnerCls: string;
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

    ngAfterViewInit() {
        // console.log('ngAfterViewInit', this.inputRef.nativeElement.querySelector('input'));
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
        console.log('find keyword');
        this.router.navigate(['/category'], {
            queryParams: { 'find': this.searchFormControl.value }
        });
    }
}
