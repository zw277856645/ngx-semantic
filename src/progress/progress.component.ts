import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2,
    SimpleChanges, TemplateRef, ViewChild
} from '@angular/core';
import { InputBoolean, InputNumber } from '@demacia/cmjs-lib';
import { Base } from '../base';
import { isNotFirstChange, isNotFirstChanges } from '../utils';
import { map } from 'rxjs/operators';

@Component({
    selector: 'sm-progress',
    templateUrl: './progress.component.html',
    styleUrls: [ '../base.less' ],
    exportAs: 'progress',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressComponent extends Base implements AfterViewInit, OnChanges {

    @ViewChild('defaultTemplate', { static: true }) @Input() template: TemplateRef<any>;

    @Input() label: string;
    @Input() @InputNumber() percent: number;

    @Input() @InputBoolean() autoSuccess = true;
    @Input() @InputBoolean() showActivity = true;
    @Input() @InputBoolean() limitValues = true;
    @Input() barLabelType: 'percent' | 'ratio' | false = 'percent';
    @Input() @InputNumber() precision = 0;
    @Input() @InputNumber() duration = 300;
    @Input() total: number | false = false;
    @Input() value: number | false = false;

    @Input() random = {
        min: 2,
        max: 5
    };

    @Input('random.min') @InputNumber() randomMin: number;
    @Input('random.max') @InputNumber() randomMax: number;

    /* tslint:disable:no-output-on-prefix */

    @Output() onChange = new EventEmitter<{ percent: number, value: number, total: number }>();
    @Output() onSuccess = new EventEmitter<{ total: number }>();
    @Output() onActive = new EventEmitter<{ value: number, total: number }>();
    @Output() onError = new EventEmitter<{ value: number, total: number }>();
    @Output() onWarning = new EventEmitter<{ value: number, total: number }>();

    @Input() regExp = {
        variable: /\{\$*[A-z0-9]+\}/g
    };

    @Input('regExp.variable') regExpVariable: RegExp;

    @Input() metadata = {
        percent: 'percent',
        total: 'total',
        value: 'value'
    };

    @Input('metadata.percent') metadataPercent: string;
    @Input('metadata.total') metadataTotal: string;
    @Input('metadata.value') metadataValue: string;

    @Input() selector = {
        bar: '> .bar',
        label: '> .label',
        progress: '.bar > .progress'
    };

    @Input('selector.bar') selectorBar: string;
    @Input('selector.label') selectorLabel: string;
    @Input('selector.progress') selectorProgress: string;

    @Input() text = {
        active: false,
        error: false,
        success: false,
        warning: false,
        percent: '{percent}%',
        ratio: '{value} of {total}'
    };

    @Input('text.active') textActive: boolean;
    @Input('text.error') textError: boolean;
    @Input('text.success') textSuccess: boolean;
    @Input('text.warning') textWarning: boolean;
    @Input('text.percent') textPercent: string;
    @Input('text.ratio') textRatio: string;

    @Input() className = {
        active: 'active',
        error: 'error',
        success: 'success',
        warning: 'warning'
    };

    @Input('className.active') classNameActive: string;
    @Input('className.error') classNameError: string;
    @Input('className.success') classNameSuccess: string;
    @Input('className.warning') classNameWarning: string;

    @Input() error = {
        method: 'The method you called is not defined.',
        nonNumeric: 'Progress value is non numeric',
        tooHigh: 'Value specified is above 100%',
        tooLow: 'Value specified is below 0%'
    };

    @Input('error.method') errorMethod: string;
    @Input('error.nonNumeric') errorNonNumeric: string;
    @Input('error.tooHigh') errorTooHigh: string;
    @Input('error.tooLow') errorTooLow: string;

    constructor(private eleRef: ElementRef,
                renderer: Renderer2) {
        super(renderer);
        super.addClasses(this.eleRef.nativeElement, 'ui progress');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.percent
            && !changes.label
            && !changes.duration
            && !changes.total
            && !changes.value
            && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
        if (isNotFirstChange(changes.percent)) {
            this.setPercent(this.percent);
        }
        if (isNotFirstChange(changes.duration)) {
            this.setDuration(this.duration);
        }
        if (isNotFirstChange(changes.total) && (typeof this.total === 'number')) {
            this.setTotal(this.total);
        }
        if (isNotFirstChange(changes.value) && (typeof this.value === 'number')) {
            this.setProgress(this.value);
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        this.ctrl = $(this.eleRef.nativeElement).progress(
            $.extend(true, {}, this.options, {
                autoSuccess: this.autoSuccess,
                showActivity: this.showActivity,
                limitValues: this.limitValues,
                label: this.barLabelType,
                precision: this.precision,
                duration: this.duration,
                random: this.random,
                total: this.total,
                value: this.value,

                onChange: (percent: number, value: number, total: number) => {
                    this.onChange.emit({ percent, value, total });
                },
                onSuccess: (total: number) => this.onSuccess.emit({ total }),
                onActive: (value: number, total: number) => this.onActive.emit({ value, total }),
                onError: (value: number, total: number) => this.onError.emit({ value, total }),
                onWarning: (value: number, total: number) => this.onWarning.emit({ value, total }),

                regExp: this.regExp,
                metadata: this.metadata,
                selector: this.selector,
                text: this.text,
                className: this.className,
                error: this.error,

                silent: this.silent,
                debug: this.debug,
                performance: this.performance,
                verbose: this.verbose
            })
        );

        if (this.percent !== null && this.percent !== undefined) {
            this.setPercent(this.percent);
        }
    }

    setPercent(percent: number) {
        this.ctrl$.subscribe(() => this.ctrl.progress('set percent', percent));
    }

    setProgress(value: number) {
        this.ctrl$.subscribe(() => this.ctrl.progress('set progress', value));
    }

    increment(value: number) {
        this.ctrl$.subscribe(() => this.ctrl.progress('increment', value));
    }

    decrement(value: number) {
        this.ctrl$.subscribe(() => this.ctrl.progress('decrement', value));
    }

    updateProgress(value: number) {
        this.ctrl$.subscribe(() => this.ctrl.progress('update progress', value));
    }

    complete() {
        this.ctrl$.subscribe(() => this.ctrl.progress('complete'));
    }

    reset() {
        this.ctrl$.subscribe(() => this.ctrl.progress('reset'));
    }

    setTotal(value: number) {
        this.ctrl$.subscribe(() => this.ctrl.progress('set total', value));
    }

    getText(templateText: string) {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('get text', templateText)));
    }

    getTextSync(templateText: string) {
        return this.ctrl ? this.ctrl.progress('get text', templateText) : null;
    }

    getNormalizedValue(value: number) {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('get normalized value', value)));
    }

    getNormalizedValueSync(value: number) {
        return this.ctrl ? this.ctrl.progress('get normalized value', value) : null;
    }

    getPercent() {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('get percent')));
    }

    getPercentSync() {
        return this.ctrl ? this.ctrl.progress('get percent') : null;
    }

    getValue() {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('get value')));
    }

    getValueSync() {
        return this.ctrl ? this.ctrl.progress('get value') : null;
    }

    getTotal() {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('get total')));
    }

    getTotalSync() {
        return this.ctrl ? this.ctrl.progress('get total') : null;
    }

    isComplete() {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('is complete')));
    }

    isCompleteSync() {
        return this.ctrl ? this.ctrl.progress('is complete') : null;
    }

    isSuccess() {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('is success')));
    }

    isSuccessSync() {
        return this.ctrl ? this.ctrl.progress('is success') : null;
    }

    isWarning() {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('is warning')));
    }

    isWarningSync() {
        return this.ctrl ? this.ctrl.progress('is warning') : null;
    }

    isError() {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('is error')));
    }

    isErrorSync() {
        return this.ctrl ? this.ctrl.progress('is error') : null;
    }

    isActive() {
        return this.ctrl$.pipe(map(() => this.ctrl.progress('is active')));
    }

    isActiveSync() {
        return this.ctrl ? this.ctrl.progress('is active') : null;
    }

    setWarning() {
        this.ctrl$.subscribe(() => this.ctrl.progress('set warning'));
    }

    setSuccess() {
        this.ctrl$.subscribe(() => this.ctrl.progress('set success'));
    }

    setError() {
        this.ctrl$.subscribe(() => this.ctrl.progress('set error'));
    }

    setDuration(duration: number) {
        this.ctrl$.subscribe(() => this.ctrl.progress('set duration', duration));
    }

    setLabel(text: string) {
        this.ctrl$.subscribe(() => this.ctrl.progress('set label', text));
    }

    setBarLabel(text: string) {
        this.ctrl$.subscribe(() => this.ctrl.progress('set bar label', text));
    }

    removeActive() {
        this.ctrl$.subscribe(() => this.ctrl.progress('remove active'));
    }

    removeWarning() {
        this.ctrl$.subscribe(() => this.ctrl.progress('remove warning'));
    }

    removeSuccess() {
        this.ctrl$.subscribe(() => this.ctrl.progress('remove success'));
    }

    removeError() {
        this.ctrl$.subscribe(() => this.ctrl.progress('remove error'));
    }

}