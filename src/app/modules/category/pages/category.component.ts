import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSelectChange, MatDialog } from '@angular/material';
import { MatPaginator, MatSort, MatSidenav, MatExpansionPanel } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { merge, Observable} from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map, filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CategoryService, EntityService, UserService } from '../../../core';
import { Category } from '../../../core/models/category.model';
import { Entity } from '../../../core/models/entity.model';
import { EntitiesDataSource } from '../../../core/datasources';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertifyService } from '../../../core/services/alertify.service';
import { MsgDialogComponent } from '../../../shared/dialog/msg-dialog.component';

@Component({
    selector: 'app-category-page',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, AfterViewInit {
    isHandset$: Observable<boolean> = this.breakpointObserver.observe([
        Breakpoints.HandsetPortrait
        , Breakpoints.Small
    ]).pipe(
        map(result => result.matches)
    );
    isAdmin: boolean;
    sideNavOpened = true;
    sideNavMode = 'push';
    searchFormControl = new FormControl();
    filterForm: FormGroup;
    isFiltered: Boolean = false;
    sortField: string;
    animationState = [];
    categoryId: number;
    category: Category;
    dataSource: EntitiesDataSource;
    expandedEntity: Entity;
    columnsToDisplay = ['name'];
    // chips
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    filters = [];


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('categoryDrawer') sidenav: MatSidenav;
    @ViewChild('filterPanel') filterPanel: MatExpansionPanel;

    constructor(
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private entityService: EntityService,
        private dialog: MatDialog,
        private breakpointObserver: BreakpointObserver,
        private userService: UserService,
        private alertifyService: AlertifyService
    ) {
        userService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });
    }

    ngOnInit() {
        this.filterForm = new FormGroup({
            rating: new FormControl(''),
            publishDate: new FormControl('')
        });
        this.categoryId = this.route.snapshot.data['id'];
        this.dataSource = new EntitiesDataSource(this.entityService);
        this.route.params
            .subscribe(
                (params: Params) => {
                    this.categoryId = params['id'];
                    this.loadEntitiesPage({name: ''});
                }
            );
        this.searchFormControl.valueChanges
            .pipe(
                debounceTime(250),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadEntitiesPage();
                })
            )
            .subscribe(
                (params: Params) => {
                    console.log('datasource ', this.dataSource);
                }
            );
        this.route.queryParams
            .subscribe(params => {
                if (params && params.find) {
                    this.searchFormControl.setValue(params.find);
                }
            });
    }
    ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadEntitiesPage())
            )
            .subscribe();
    }
    loadEntitiesPage(filters: Object = {}) {
        console.log('loadEntitiesPage', this.sort.direction);
        const defaultFilter = {};
        filters = Object.assign(
            this.searchFormControl.value ? {name: this.searchFormControl.value} : {},
            this.categoryId ? {categoryId: this.categoryId} : {},
            filters
        );
        this.dataSource.loadEntities(
            filters,
            this.sort.direction,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize
        );
    }
    toggleShowDiv(index: number) {
        if (index > -1) {
            this.animationState[index] = this.animationState[index] === 'out' ? 'in' : 'out';
        }
    }
    toggleFilter(color) {
        this.isFiltered = !this.isFiltered;
        if (this.isFiltered) {
            this.filterPanel.open();
        } else {
            this.filterPanel.close();
        }
    }
    sortEntities(event: MatSelectChange) {
        const field = event.value;
        this.sort.active = field;
        this.sort.direction = this.sort.direction || 'desc';
        this.sort.sortChange.emit();
    }
    sortDirection() {
        this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
        this.sort.sortChange.emit();
    }
    applyFilter() {
        const form = this.filterForm.value;
        this.filters = [
            { name: 'Published Date', field: 'publishDate'},
            { name: 'Rating', field: 'rating'}
        ].filter((item) => form[item.field]);

        this.loadEntitiesPage(Object.assign(
            {},
            form.rating ? {rating: form.rating} : {},
            form.publishDate ? {createdAt: form.publishDate} : {}
        ));
    }
    resetFilter() {
        this.filterForm.reset({ rating: '', publishDate: '' });
        this.filters = [];
        this.loadEntitiesPage();
    }

    remove(filterItem): void {
        console.log('remove filter', filterItem);
        const index = this.filters.indexOf(filterItem);
        if (index >= 0) {
            this.filters.splice(index, 1);
            this.filterForm.get(filterItem.field).reset('');
            this.applyFilter();
        }
    }

    onDelete(entity: Entity) {
        const dialogRef = this.dialog.open(MsgDialogComponent, {
            data: {
                type: 'confirm',
                msg: `Are you sure, you want to delete this ${entity.name}?`
            },
            width: '500px',
            hasBackdrop: true,
            panelClass: ''
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.proceed) {
                this.entityService.delete(entity.id)
                    .subscribe(del => {
                        console.log('del', del);
                        if (del) {
                            this.alertifyService.success('Successfully deleted');
                            this.loadEntitiesPage();
                        }
                    });
            }
        });
    }
}
