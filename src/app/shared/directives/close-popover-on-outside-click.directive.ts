import { Directive, HostListener, ElementRef, ComponentRef } from '@angular/core';
import { ToolbarNotificationComponent } from '../toolbar-notification/toolbar-notification.component';


@Directive({
    selector: '[appClosePopoverOnOutsideClick]'
})
export class ClosePopoverOnOutsideClickDirective {

    constructor(
        private elementRef: ElementRef,
        private ngbPopover: ToolbarNotificationComponent
    ) {
        console.log('ClosePopoverOnOutsideClick');
    }

    @HostListener('document:click', ['$event'])
    private documentClicked(event: MouseEvent): void {

        // Popover is open
        if (this.ngbPopover && this.ngbPopover.isOpen) {

            // Not clicked on self element
            if (!this.elementRef.nativeElement.contains(event.target)) {

                this.ngbPopover.close();
                // Hacking typescript to access private member
                // const popoverWindowRef: ComponentRef<ToolbarNotificationComponent> = (this.ngbPopover as any)._windowRef;
                // console.log('popoverWindowRef', popoverWindowRef);

                // If clicked outside popover window
                // if (!popoverWindowRef.location.nativeElement.contains(event.target)) {
                //     this.ngbPopover.close();
                // }
            }
        }
    }
}
