import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../../core';

@Component({
    selector: 'app-layout-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
    isAdmin: boolean;
    constructor(
        private router: Router,
        private userService: UserService
    ) {}
    ngOnInit() {

    }
}
