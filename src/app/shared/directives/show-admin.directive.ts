import { Directive, TemplateRef, ViewContainerRef, OnInit, Input } from '@angular/core';
import { UserService } from '../../core';
import { take, debounceTime, last, map, distinctUntilChanged } from 'rxjs/operators';

@Directive({
    selector: '[appShowAdmin]'
})
export class ShowAdminDirective implements OnInit {
    constructor(
        private templateRef: TemplateRef<any>,
        private userService: UserService,
        private viewContainer: ViewContainerRef
    ) { }

    condition: boolean;

    ngOnInit() {
        this.userService.isAdmin.pipe(
            distinctUntilChanged(),
            debounceTime(50)
        )
            .subscribe(isAdmin => {
                console.log('ShowAuthedDirective isAdmin', isAdmin);
                if ((isAdmin && this.condition) || (!isAdmin && !this.condition)) {
                    this.viewContainer.clear();
                    this.viewContainer.createEmbeddedView(this.templateRef);
                } else {
                    this.viewContainer.clear();
                }
        });
    }

    @Input() set appShowAdmin(condition: boolean) {
        this.condition = condition;
    }

}
