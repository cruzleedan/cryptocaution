import { Directive, Input, Self, Host, AfterContentInit } from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material';
import { NgControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appEnforcedInputs]'
})
export class EnforcedInputsDirective implements AfterContentInit {

    @Input() formControl: FormControl;
    @Input() matAutocomplete: MatAutocomplete;

    subscription: Subscription;
    constructor(@Host() @Self() private readonly autoCompleteTrigger: MatAutocompleteTrigger, private control: NgControl) {
    }
    ngAfterContentInit() {
        console.log('ngAfterContentInit', this.formControl);
        if (this.formControl === undefined) {
            throw Error('inputCtrl @Input should be provided ');
        }

        if (this.matAutocomplete === undefined) {
            throw Error('valueCtrl @Input should be provided ');
        }

        setTimeout(() => {
            this.subscribeToClosingActions();
            this.handelSelection();
        }, 0);
    }
    private subscribeToClosingActions(): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.autoCompleteTrigger.panelClosingActions
            .subscribe((e) => {
                if (!e || !e.source) {
                    console.log('subscribe to closing actions', this.formControl.value);
                    const selected = this.matAutocomplete.options
                        .map(option => option.value)
                        .find(option => option === this.formControl.value);

                    if (selected == null) {
                        this.formControl.setValue(null);
                    }
                }
            },
                err => this.subscribeToClosingActions(),
                () => this.subscribeToClosingActions());
    }
    private handelSelection() {
        this.matAutocomplete.optionSelected.subscribe((e: MatAutocompleteSelectedEvent) => {
            this.formControl.setValue(e.option.value);
        });
    }
}
