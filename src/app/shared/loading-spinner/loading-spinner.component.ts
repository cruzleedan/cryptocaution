import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent implements OnInit {

    @Input() class;
    @Input() style;
    constructor() { }

    ngOnInit() {
        this.style = this.style || {'width': '50px', 'height': '40px'};
    }

}
