import { ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { InputBoolean } from '@demacia/cmjs-lib';
import { OutputReturnWrapper } from '../utils';
import { Base } from '../base';
import { map } from 'rxjs/operators';

export abstract class CheckboxBase extends Base {

    @Input() label: string;

    @Input() uncheckable: 'auto' | boolean = 'auto';
    @Input() @InputBoolean() fireOnInit = false;

    /* tslint:disable:no-output-on-prefix */

    @Output() beforeChecked = new EventEmitter<OutputReturnWrapper<void>>();
    @Output() beforeUnchecked = new EventEmitter<OutputReturnWrapper<void>>();
    @Output() beforeDeterminate = new EventEmitter<OutputReturnWrapper<void>>();
    @Output() beforeIndeterminate = new EventEmitter<OutputReturnWrapper<void>>();
    @Output() onChange = new EventEmitter();
    @Output() onChecked = new EventEmitter();
    @Output() onUnchecked = new EventEmitter();
    @Output() onDeterminate = new EventEmitter();
    @Output() onIndeterminate = new EventEmitter();
    @Output() onEnable = new EventEmitter();
    @Output() onDisable = new EventEmitter();

    @Input() className = {
        checked: 'checked',
        indeterminate: 'indeterminate',
        disabled: 'disabled',
        hidden: 'hidden',
        readOnly: 'read-only'
    };

    @Input('className.checked') classNameChecked: string;
    @Input('className.indeterminate') classNameIndeterminate: string;
    @Input('className.disabled') classNameDisabled: string;
    @Input('className.hidden') classNameHidden: string;
    @Input('className.readOnly') classNameReadOnly: string;

    @Input() selector = {
        label: 'label',
        input: 'input[type="checkbox"], input[type="radio"]'
    };

    @Input('selector.label') selectorLabel: string;
    @Input('selector.input') selectorInput: string;

    @Input() error = {
        method: 'The method you called is not defined'
    };

    @Input('error.method') errorMethod: string;

    protected constructor(eleRef: ElementRef,
                          renderer: Renderer2) {
        super(renderer);
        super.addClasses(eleRef.nativeElement, 'ui checkbox');
    }

    attachEvents(selector: string, event: string) {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('attach events', selector, event));
    }

    toggle() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('toggle'));
    }

    check() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('check'));
    }

    uncheck() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('uncheck'));
    }

    indeterminate() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('indeterminate'));
    }

    determinate() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('determinate'));
    }

    enable() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('enable'));
    }

    setChecked() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('set checked'));
    }

    setUnchecked() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('set unchecked'));
    }

    setIndeterminate() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('set indeterminate'));
    }

    setDeterminate() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('set determinate'));
    }

    setEnabled() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('set enabled'));
    }

    setDisabled() {
        this.ctrl$.subscribe(() => this.ctrl.checkbox('set disabled'));
    }

    isRadio() {
        return this.ctrl$.pipe(map(() => this.ctrl.checkbox('is radio')));
    }

    isRadioSync() {
        return this.ctrl ? this.ctrl.checkbox('is radio') : null;
    }

    isChecked() {
        return this.ctrl$.pipe(map(() => this.ctrl.checkbox('is checked')));
    }

    isCheckedSync() {
        return this.ctrl ? this.ctrl.checkbox('is checked') : null;
    }

    isUnchecked() {
        return this.ctrl$.pipe(map(() => this.ctrl.checkbox('is unchecked')));
    }

    isUncheckedSync() {
        return this.ctrl ? this.ctrl.checkbox('is unchecked') : null;
    }

    canChange() {
        return this.ctrl$.pipe(map(() => this.ctrl.checkbox('can change')));
    }

    canChangeAsync() {
        return this.ctrl ? this.ctrl.checkbox('can change') : null;
    }

    shouldAllowCheck() {
        return this.ctrl$.pipe(map(() => this.ctrl.checkbox('should allow check')));
    }

    shouldAllowCheckSync() {
        return this.ctrl ? this.ctrl.checkbox('should allow check') : null;
    }

    shouldAllowUncheck() {
        return this.ctrl$.pipe(map(() => this.ctrl.checkbox('should allow uncheck')));
    }

    shouldAllowUncheckSync() {
        return this.ctrl ? this.ctrl.checkbox('should allow uncheck') : null;
    }

    shouldAllowDeterminate() {
        return this.ctrl$.pipe(map(() => this.ctrl.checkbox('should allow determinate')));
    }

    shouldAllowDeterminateSync() {
        return this.ctrl ? this.ctrl.checkbox('should allow determinate') : null;
    }

    shouldAllowIndeterminate() {
        return this.ctrl$.pipe(map(() => this.ctrl.checkbox('should allow indeterminate')));
    }

    shouldAllowIndeterminateSync() {
        return this.ctrl ? this.ctrl.checkbox('should allow indeterminate') : null;
    }

    canUncheck() {
        return this.ctrl$.pipe(map(() => this.ctrl.checkbox('can uncheck')));
    }

    canUncheckSync() {
        return this.ctrl ? this.ctrl.checkbox('can uncheck') : null;
    }

    get finalOptions() {
        return $.extend(true, {}, this.options, {
            uncheckable: this.uncheckable,
            fireOnInit: this.fireOnInit,

            beforeChecked: () => {
                let returnValue = null;
                this.beforeChecked.emit((cb: Function | any) => {
                    return returnValue = typeof cb === 'function' ? cb() : !!cb;
                });

                return returnValue !== false;
            },
            beforeUnchecked: () => {
                let returnValue = null;
                this.beforeUnchecked.emit((cb: Function) => {
                    returnValue = typeof cb === 'function' ? cb() : !!cb;
                });

                return returnValue !== false;
            },
            beforeDeterminate: () => {
                let returnValue = null;
                this.beforeDeterminate.emit((cb: Function) => {
                    returnValue = typeof cb === 'function' ? cb() : !!cb;
                });

                return returnValue !== false;
            },
            beforeIndeterminate: () => {
                let returnValue = null;
                this.beforeIndeterminate.emit((cb: Function) => {
                    returnValue = typeof cb === 'function' ? cb() : !!cb;
                });

                return returnValue !== false;
            },

            onChange: () => this.onChange.emit(),
            onChecked: () => this.onChecked.emit(),
            onUnchecked: () => this.onUnchecked.emit(),
            onDeterminate: () => this.onDeterminate.emit(),
            onIndeterminate: () => this.onIndeterminate.emit(),
            onEnable: () => this.onEnable.emit(),
            onDisable: () => this.onDisable.emit(),

            selector: this.selector,
            className: this.className,
            error: this.error,

            silent: this.silent,
            debug: this.debug,
            performance: this.performance,
            verbose: this.verbose
        });
    }
}