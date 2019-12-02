import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output,
    Renderer2, SimpleChanges
} from '@angular/core';
import { Base } from '../base';
import { InputArray, InputBoolean, InputNumber } from '@demacia/cmjs-lib';
import { ElementSelector, isNotFirstChange, isNotFirstChanges, OutputReturnWrapper } from '../utils';
import { map } from 'rxjs/operators';
import DimmerSettings = SemanticUI.DimmerSettings;

@Component({
    selector: 'sm-modal',
    template: '<ng-content></ng-content>',
    styleUrls: [ '../base.less' ],
    exportAs: 'modal',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent extends Base implements AfterViewInit, OnChanges, OnDestroy {

    @Input() @InputBoolean() visible: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() @InputArray() eventSources: (Event | Element)[];
    @Output() eventSourcesChange = new EventEmitter();

    @Input() @InputBoolean() observeChanges = false;
    @Input() @InputBoolean() allowMultiple = false;
    @Input() @InputBoolean() detachable = true;
    @Input() @InputBoolean() closable = true;
    @Input() @InputBoolean() autofocus = false;
    @Input() @InputBoolean() inverted = false;
    @Input() @InputBoolean() blurring = false;
    @Input() @InputBoolean() keyboardShortcuts = true;
    @Input() context: ElementSelector = 'body';
    @Input() @InputBoolean() queue = false;
    @Input() @InputNumber() duration = 500;
    @Input() @InputNumber() offset = 0;
    @Input() transition = 'drop';

    @Input() dimmerSettings: DimmerSettings = {
        closable: false,
        useCSS: true
    };

    /* tslint:disable:no-output-on-prefix */

    @Output() onShow = new EventEmitter();
    @Output() onVisible = new EventEmitter();
    @Output() onHide = new EventEmitter<OutputReturnWrapper<JQuery>>();
    @Output() onHidden = new EventEmitter();
    @Output() onApprove = new EventEmitter<OutputReturnWrapper<JQuery>>();
    @Output() onDeny = new EventEmitter<OutputReturnWrapper<JQuery>>();

    @Input() selector = {
        close: '> .close',
        approve: '.actions .positive, .actions .approve, .actions .ok',
        deny: '.actions .negative, .actions .deny, .actions .cancel'
    };

    @Input('selector.close') selectorClose: string;
    @Input('selector.approve') selectorApprove: string;
    @Input('selector.deny') selectorDeny: string;

    @Input() className = {
        active: 'active',
        animating: 'animating',
        blurring: 'blurring',
        inverted: 'inverted',
        loading: 'loading',
        scrolling: 'scrolling',
        undetached: 'undetached',
        eventSource: 'modal-open'
    };

    @Input('className.active') classNameActive: string;
    @Input('className.animating') classNameAnimating: string;
    @Input('className.blurring') classNameBlurring: string;
    @Input('className.inverted') classNameInverted: string;
    @Input('className.loading') classNameLoading: string;
    @Input('className.scrolling') classNameScrolling: string;
    @Input('className.undetached') classNameUndetached: string;
    @Input('className.eventSource') classNameEventSource: string;

    @Input() error = {
        dimmer: 'UI Dimmer, a required component is not included in this page',
        method: 'The method you called is not defined.',
        notFound: 'The element you specified could not be found'
    };

    @Input('error.dimmer') errorDimmer: string;
    @Input('error.method') errorMethod: string;
    @Input('error.notFound') errorNotFound: string;

    constructor(renderer: Renderer2,
                protected eleRef: ElementRef) {
        super(renderer);
        super.addClasses(this.eleRef.nativeElement, 'ui modal');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.visible && !changes.eventSource && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
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

        this.ctrl = $(this.eleRef.nativeElement).modal(
            $.extend(true, {}, this.options, {
                observeChanges: this.observeChanges,
                allowMultiple: this.allowMultiple,
                detachable: this.detachable,
                closable: this.closable,
                autofocus: this.autofocus,
                inverted: this.inverted,
                blurring: this.blurring,
                keyboardShortcuts: this.keyboardShortcuts,
                context: this.context,
                queue: this.queue,
                duration: this.duration,
                offset: this.offset,
                transition: this.transition,
                dimmerSettings: this.dimmerSettings,

                onShow: () => {
                    this.onShow.emit();

                    // 修复某些情况下 sm-modal 被 semantic 设置成 display:inline 的 BUG
                    $(this.eleRef.nativeElement).data('display', 'block');

                    if (this.eventSources && this.eventSources.length) {
                        this.eventSources.forEach(eventSource => {
                            if (eventSource instanceof Event) {
                                eventSource.stopPropagation();
                            }

                            super.addClasses(
                                ModalComponent.getElement(eventSource),
                                this.className.eventSource
                            );
                        });
                    }
                },
                onVisible: () => {
                    this.visible = true;
                    this.visibleChange.emit(true);
                    this.onVisible.emit();
                },
                onHide: (ele: any) => {
                    let returnValue = null;
                    this.onHide.emit((cb: Function) => {
                        returnValue = typeof cb === 'function' ? cb(ele) : !!cb;
                    });

                    if (returnValue !== false && this.eventSources && this.eventSources.length) {
                        this.eventSources.forEach(eventSource => {
                            super.removeClasses(
                                ModalComponent.getElement(eventSource),
                                this.className.eventSource
                            );
                        });
                    }

                    return returnValue !== false;
                },
                onHidden: () => {
                    this.visible = false;
                    this.visibleChange.emit(false);
                    this.onHidden.emit();
                },
                onApprove: (ele: any) => {
                    let returnValue = null;
                    this.onApprove.emit((cb: Function) => {
                        returnValue = typeof cb === 'function' ? cb(ele) : !!cb;
                    });

                    return returnValue !== false;
                },
                onDeny: (ele: any) => {
                    let returnValue = null;
                    this.onDeny.emit((cb: Function) => {
                        returnValue = typeof cb === 'function' ? cb(ele) : !!cb;
                    });

                    return returnValue !== false;
                },

                selector: this.selector,
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

    ngOnDestroy() {
        // modal 会被移到全局 .ui.page.modals 中，modal 所在的组件销毁时，modal 没有被删除，手动删除
        (this.eleRef.nativeElement as Element).parentElement.removeChild(this.eleRef.nativeElement);
    }

    attachEvents(selector: any, event?: string) {
        this.ctrl$.subscribe(() => this.ctrl.modal('attach events', selector, event));
    }

    show() {
        this.ctrl$.subscribe(() => this.ctrl.modal('show'));
    }

    hide() {
        this.ctrl$.subscribe(() => this.ctrl.modal('hide'));
    }

    toggle() {
        this.ctrl$.subscribe(() => this.ctrl.modal('toggle'));
    }

    refresh() {
        this.ctrl$.subscribe(() => this.ctrl.modal('refresh'));
    }

    showDimmer() {
        this.ctrl$.subscribe(() => this.ctrl.modal('show dimmer'));
    }

    hideDimmer() {
        this.ctrl$.subscribe(() => this.ctrl.modal('hide dimmer'));
    }

    hideOthers() {
        this.ctrl$.subscribe(() => this.ctrl.modal('hide others'));
    }

    hideAll() {
        this.ctrl$.subscribe(() => this.ctrl.modal('hide all'));
    }

    cacheSizes() {
        this.ctrl$.subscribe(() => this.ctrl.modal('cache sizes'));
    }

    canFit() {
        return this.ctrl$.pipe(map(() => this.ctrl.modal('can fit')));
    }

    canFitSync() {
        return this.ctrl ? this.ctrl.modal('can fit') : null;
    }

    isActive() {
        return this.ctrl$.pipe(map(() => this.ctrl.modal('is active')));
    }

    isActiveSync() {
        return this.ctrl ? this.ctrl.modal('is active') : null;
    }

    setActive() {
        this.ctrl$.subscribe(() => this.ctrl.modal('set active'));
    }

    private static getElement(eventSource: Event | Element) {
        if (eventSource instanceof Event) {
            return eventSource.srcElement || eventSource.currentTarget;
        } else {
            return eventSource;
        }
    }

}