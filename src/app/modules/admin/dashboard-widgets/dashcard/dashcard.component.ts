import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-dashcard',
    templateUrl: './dashcard.component.html',
    styleUrls: ['./dashcard.component.scss']
})
export class DashcardComponent implements OnInit {

    @Input() dashData: any;
    constructor() { }

    ngOnInit() {
    }

}
