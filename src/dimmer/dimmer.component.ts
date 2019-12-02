import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2,
    SimpleChanges
} from '@angular/core';
import { Base } from '../base';
import { InputBoolean, InputNumber } from '@demacia/cmjs-lib';
import { isNotFirstChange, isNotFirstChanges, string2Number } from '../utils';
import { map } from 'rxjs/operators';
import Selector = SemanticUI.Selector;

@Component({
    selector: 'sm-dimmer',
    template: '<ng-content></ng-content>',
    styleUrls: [ '../base.less' ],
    exportAs: 'dimmer',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimmerComponent extends Base implements AfterViewInit, OnChanges {

    @Input() @InputBoolean() visible: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() opacity: number | string | 'auto' = 'auto';
    @Input() variation: string | false = false;
    @Input() dimmerName: string | false = false;
    @Input() closable: boolean | 'auto' = 'auto';
    @Input() on: 'hover' | 'click' | false = false;
    @Input() @InputBoolean() useCSS = true;
    @Input() transition = 'fade';

    @Input() duration = {
        show: 500,
        hide: 500
    };

    @Input() @InputNumber() durationShow: number;
    @Input() @InputNumber() durationHide: number;

    /* tslint:disable:no-output-on-prefix */

    @Output() onShow = new EventEmitter();
    @Output() onHide = new EventEmitter();
    @Output() onChange = new EventEmitter();

    @Input() selector = {
        content: '.ui.dimmer > .content, .ui.dimmer > .content > .center'
    };

    @Input('selector.content') selectorContent: string;

    @Input() template = {
        dimmer: () => {
            return $('<div />').attr('class', 'ui dimmer');
        }
    };

    @Input('template.dimmer') templateDimmer: () => JQuery;

    @Input() className = {
        active: 'active',
        animating: 'animating',
        dimmable: 'dimmable',
        dimmed: 'dimmed',
        dimmer: 'dimmer',
        disabled: 'disabled',
        hide: 'hide',
        pageDimmer: 'page',
        show: 'show'
    };

    @Input('className.active') classNameActive: string;
    @Input('className.animating') classNameAnimating: string;
    @Input('className.dimmable') classNameDimmable: string;
    @Input('className.dimmed') classNameDimmed: string;
    @Input('className.dimmer') classNameDimmer: string;
    @Input('className.disabled') classNameDisabled: string;
    @Input('className.hide') classNameHide: string;
    @Input('className.pageDimmer') classNamePageDimmer: string;
    @Input('className.show') classNameShow: string;

    @Input() error = {
        method: 'The method you called is not defined.'
    };

    @Input('error.method') errorMethod: string;

    constructor(private eleRef: ElementRef,
                renderer: Renderer2) {
        super(renderer);
        super.addClasses(this.eleRef.nativeElement, 'ui dimmer');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.visible && !changes.opacity && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
        if (isNotFirstChange(changes.opacity)
            && (typeof this.opacity === 'number' || typeof this.opacity === 'string')) {
            this.setOpacity(this.opacity);
        }
        if (isNotFirstChange(changes.visible)) {
            if (this.visible) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        this.ctrl = $(this.eleRef.nativeElement).dimmer(
            $.extend(true, {}, this.options, {
                opacity: string2Number(this.opacity),
                variation: this.variation,
                dimmerName: this.dimmerName,
                closable: this.closable,
                on: this.on,
                useCSS: this.useCSS,
                transition: this.transition,
                duration: this.duration,

                onShow: () => {
                    this.visible = true;
                    this.visibleChange.emit(true);
                    this.onShow.emit();
                },
                onHide: () => {
                    this.visible = false;
                    this.visibleChange.emit(false);
                    this.onHide.emit();
                },
                onChange: () => this.onChange.emit(),

                selector: this.selector,
                template: this.template,
                className: this.className,
                error: this.error,

                silent: this.silent,
                debug: this.debug,
                performance: this.performance,
                verbose: this.verbose
            })
        );

        if (this.visible) {
            this.show();
        }
    }

    addContent(element: Selector) {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('add content', element));
    }

    show() {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('show'));
    }

    hide() {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('hide'));
    }

    toggle() {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('toggle'));
    }

    setOpacity(opacity: number | string) {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('set opacity', string2Number(opacity)));
    }

    create() {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('create'));
    }

    getDuration() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('get duration')));
    }

    getDurationSync() {
        return this.ctrl ? this.ctrl.dimmer('get duration') : null;
    }

    getDimmer() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('get dimmer')));
    }

    getDimmerSync() {
        return this.ctrl ? this.ctrl.dimmer('get dimmer') : null;
    }

    hasDimmer() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('has dimmer')));
    }

    hasDimmerSync() {
        return this.ctrl ? this.ctrl.dimmer('has dimmer') : null;
    }

    isActive() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('is active')));
    }

    isActiveSync() {
        return this.ctrl ? this.ctrl.dimmer('is active') : null;
    }

    isAnimating() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('is animating')));
    }

    isAnimatingSync() {
        return this.ctrl ? this.ctrl.dimmer('is animating') : null;
    }

    isDimmer() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('is dimmer')));
    }

    isDimmerSync() {
        return this.ctrl ? this.ctrl.dimmer('is dimmer') : null;
    }

    isDimmable() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('is dimmable')));
    }

    isDimmableSync() {
        return this.ctrl ? this.ctrl.dimmer('is dimmable') : null;
    }

    isDisabled() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('is disabled')));
    }

    isDisabledSync() {
        return this.ctrl ? this.ctrl.dimmer('is disabled') : null;
    }

    isEnabled() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('is enabled')));
    }

    isEnabledSync() {
        return this.ctrl ? this.ctrl.dimmer('is enabled') : null;
    }

    isPage() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('is page')));
    }

    isPageSync() {
        return this.ctrl ? this.ctrl.dimmer('is page') : null;
    }

    isPageDimmer() {
        return this.ctrl$.pipe(map(() => this.ctrl.dimmer('is page dimmer')));
    }

    isPageDimmerSync() {
        return this.ctrl ? this.ctrl.dimmer('is page dimmer') : null;
    }

    setActive() {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('set active'));
    }

    setDimmable() {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('set dimmable'));
    }

    setDimmed() {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('set dimmed'));
    }

    setPageDimmer() {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('set page dimmer'));
    }

    setDisabled() {
        this.ctrl$.subscribe(() => this.ctrl.dimmer('set disabled'));
    }
}