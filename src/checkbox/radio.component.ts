import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxBase } from './checkbox-base';
import { isNotFirstChanges } from '../utils';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sm-radio',
    templateUrl: './radio.component.html',
    styleUrls: [ '../base.less' ],
    exportAs: 'radio',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RadioComponent,
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent extends CheckboxBase implements AfterViewInit, OnChanges {

    @Input() value: any;
    @Input() name: string;

    private _value: any;
    private controlChange: Function = new Function();
    private controlTouch: Function = new Function();
    private modelSub: Subscription;

    constructor(private eleRef: ElementRef,
                renderer: Renderer2) {
        super(eleRef, renderer);
        super.addClasses(this.eleRef.nativeElement, 'radio');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.label && !changes.value && !changes.name && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        this.ctrl = $(this.eleRef.nativeElement).checkbox({
            ...this.finalOptions,
            onChecked: () => {
                this._value = this.truthValue;
                this.controlChange(this.truthValue);
                this.controlTouch(this.truthValue);
                this.onChecked.emit();
            }
        });
    }

    writeValue(value: boolean) {
        if (this.modelSub) {
            this.modelSub.unsubscribe();
        }

        this.modelSub = this.ctrl$.subscribe(() => {
            if (value !== this._value) {
                this._value = value;

                if (value === this.truthValue) {
                    this.setChecked();
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

    get truthValue() {
        return this.value === undefined ? true : this.value;
    }
}