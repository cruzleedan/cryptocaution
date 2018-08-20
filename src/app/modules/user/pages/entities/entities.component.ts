import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { PageEvent, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { UserService, AlertifyService, User, EntityService } from '../../../../core';
import { Review } from '../../../../core/models/review.model';
import { FormControl } from '@angular/forms';
import { MsgDialogComponent } from '../../../../shared/dialog/msg-dialog.component';
import { Entity } from '../../../../core/models/entity.model';

@Component({
    selector: 'app-entities',
    templateUrl: './entities.component.html',
    styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
    loading = false;
    userEntities: Entity[];
    user: User;
    searchControl: FormControl;
    baseUrl = environment.baseUrl;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('input', {
        read: ElementRef
    }) myInput: ElementRef;
    constructor(
        private userService: UserService,
        private entityService: EntityService
    ) {
        this.searchControl = new FormControl('');
        this.loadUserEntities();
        this.userService.loading$.subscribe(isLoading => {
            this.loading = isLoading;
        });
        this.userService.currentUser
            .subscribe(user => {
                this.user = user;
            });
    }

    ngOnInit() {

    }
    pageChange(event?: PageEvent) {
        console.log('event', event);
        this.loadUserEntities();
    }
    loadUserEntities(
        sort: string = 'desc',
        sortField: string = 'createdAt'
    ) {
        this.userService.findUserEntities(
            this.searchControl.value, // filter = '',
            sort, // sortDirection = 'desc',
            sortField, // sortField = 'rating',
            this.paginator && this.paginator.pageIndex ? this.paginator.pageIndex : 0, // pageNumber: number = 1,
            this.paginator && this.paginator.pageSize ? this.paginator.pageSize : 10  // pageSize: number = 10
        )
            .subscribe(entities => {
                this.userEntities = entities;
            });
    }
}
