import {fromEvent as observableFromEvent,  Observable } from 'rxjs';

import {distinctUntilChanged, debounceTime, tap} from 'rxjs/operators';
import { Component, OnInit , ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { UsersDataSource } from '../../../../../../core/datasources/users.datasource';
import { UserService } from '../../../../../../core';
import { environment } from '../../../../../../../environments/environment';

@Component({
    selector: 'app-users-tbl',
    templateUrl: './users-tbl.component.html',
    styleUrls: ['./users-tbl.component.scss']
})
export class UsersTblComponent implements OnInit, AfterViewInit {
    baseUrl = environment.baseUrl;
    showNavListCode;
    displayedColumns = ['select', 'avatar', 'username', 'firstname', 'lastname', 'email', 'blockFlag', 'action'];
    selection = new SelectionModel<string>(true, []);
    dataSource: UsersDataSource;
    // allfeatures = TABLE_HELPERS;
    constructor(
        private userService: UserService
    ) { }
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.dataSource = new UsersDataSource(this.userService);
        this.loadUsers();
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
                tap(() => this.loadUsers())
            )
            .subscribe();
    }
    loadUsers() {
        const filter = this.filter.nativeElement.value || '';
        const fields = ['username'];
        this.dataSource.loadUsers(
            filter,
            fields,
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
