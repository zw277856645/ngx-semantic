import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnChanges, Renderer2, SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNotFirstChanges } from '../utils';
import { CheckboxBase } from './checkbox-base';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sm-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: [ '../base.less' ],
    exportAs: 'checkbox',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CheckboxComponent,
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent extends CheckboxBase implements OnChanges, AfterViewInit, ControlValueAccessor {

    private _checked: boolean;
    private controlChange: Function = new Function();
    private controlTouch: Function = new Function();
    private modelSub: Subscription;

    constructor(private eleRef: ElementRef,
                renderer: Renderer2) {
        super(eleRef, renderer);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.label && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        this.ctrl = $(this.eleRef.nativeElement).checkbox({
            ...this.finalOptions,
            onChecked: () => {
                this._checked = true;
                this.controlChange(true);
                this.controlTouch(true);
                this.onChecked.emit();
            },
            onUnchecked: () => {
                this._checked = false;
                this.controlChange(false);
                this.controlTouch(false);
                this.onUnchecked.emit();
            }
        });
    }

    writeValue(value: boolean) {
        if (this.modelSub) {
            this.modelSub.unsubscribe();
        }

        this.modelSub = this.ctrl$.subscribe(() => {
            if (value !== this._checked) {
                this._checked = value;

                if (value === true) {
                    this.setChecked();
                } else {
                    this.setUnchecked();
                }
            }
        });
    }

    registerOnChange(fn: Function) {
        this.controlChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.controlTouch = fn;
    }

}