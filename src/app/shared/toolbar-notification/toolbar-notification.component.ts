import { Component, OnInit, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'app-toolbar-notification',
    templateUrl: './toolbar-notification.component.html',
    styleUrls: ['./toolbar-notification.component.scss']
})
export class ToolbarNotificationComponent implements OnInit {

    cssPrefix = 'toolbar-notification';
    isOpen = false;
    @Input() notifications = [];

    // @HostListener('document:click', ['$event', '$event.target'])
    // onClick(event: MouseEvent, targetElement: HTMLElement) {
    //     if (!targetElement) {
    //           return;
    //     }
    //     const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    //     if (!clickedInside) {
    //          this.isOpen = false;
    //     }
    // }

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
    }
    close() {
        this.isOpen = false;
    }
    open() {
        this.isOpen = true;
    }
    select() {

    }

    delete(notification) {

    }

}
