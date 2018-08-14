import { Directive, TemplateRef, ViewContainerRef, OnInit, Input } from '@angular/core';
import { UserService } from '../../core';
import { take, debounceTime, last, map, distinctUntilChanged } from 'rxjs/operators';

@Directive({
    selector: '[appShowAuthed]'
})
export class ShowAuthedDirective implements OnInit {

    constructor(
        private templateRef: TemplateRef<any>,
        private userService: UserService,
        private viewContainer: ViewContainerRef
    ) { }

    condition: boolean;

    ngOnInit() {
        this.userService.isAuthenticated.pipe(
            distinctUntilChanged(),
            debounceTime(50)
        )
            .subscribe(isAuthenticated => {
                console.log('ShowAuthedDirective isAuthenticated', isAuthenticated);
                if ((isAuthenticated && this.condition) || (!isAuthenticated && !this.condition)) {
                    this.viewContainer.clear();
                    this.viewContainer.createEmbeddedView(this.templateRef);
                } else {
                    this.viewContainer.clear();
                }
        });
    }

    @Input() set appShowAuthed(condition: boolean) {
        this.condition = condition;
    }

}
