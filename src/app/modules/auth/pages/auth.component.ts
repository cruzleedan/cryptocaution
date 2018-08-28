import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-auth-page',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    loading = false;
    constructor() {
    }

    ngOnInit() {

    }
}
