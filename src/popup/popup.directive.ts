import {
    AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, Renderer2, SimpleChanges
} from '@angular/core';
import { Base } from '../base';
import { InputBoolean, InputNumber } from '@demacia/cmjs-lib';
import { classesContains, ElementSelector, isNotFirstChange, isNotFirstChanges, OutputReturnWrapper } from '../utils';
import { PopupContentComponent } from './popup-content.component';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[smPopup]',
    exportAs: 'popup'
})
export class PopupDirective extends Base implements OnChanges, AfterViewInit {

    @Input() popup: false | ElementSelector | PopupContentComponent;
    @Input() @InputBoolean() exclusive = false;
    @Input() @InputBoolean() movePopup = true;
    @Input() @InputBoolean() observeChanges = true;
    @Input() boundary: ElementSelector | Window = window;
    @Input() context: ElementSelector = 'body';
    @Input() scrollContext: ElementSelector | Window = window;
    @Input() @InputNumber() jitter = 2;
    @Input() position = 'bottom right';
    @Input() @InputBoolean() inline = false;
    @Input() @InputBoolean() preserve = false;
    @Input() prefer: 'opposite' | 'adjacent' = 'opposite';
    @Input() lastResort: boolean | string = false;
    @Input() on = 'click';
    @Input() transition = 'scale';
    @Input() @InputNumber() duration = 200;
    @Input() @InputBoolean() setFluidWidth = true;
    @Input() @InputBoolean() hoverable = false;
    @Input() @InputBoolean() closable = true;
    @Input() @InputBoolean() addTouchEvents = true;
    @Input() hideOnScroll: 'auto' | boolean = 'auto';
    @Input() target: false | ElementSelector = false;
    @Input() @InputNumber() distanceAway = 0;
    @Input() @InputNumber() offset = 0;
    @Input() @InputNumber() maxSearchDepth = 15;
    @Input() variation = '';
    @Input() content: false | string = false;
    @Input() html: false | string = false;
    @Input() title: false | string = false;

    @Input() delay = {
        show: 50,
        hide: 0
    };

    @Input('delay.show') delayShow: number;
    @Input('delay.hide') delayHide: number;

    /* tslint:disable:no-output-on-prefix */

    @Output() onCreate = new EventEmitter<JQuery>();
    @Output() onRemove = new EventEmitter<JQuery>();
    @Output() onShow = new EventEmitter<OutputReturnWrapper<JQuery>>();
    @Output() onVisible = new EventEmitter<JQuery>();
    @Output() onHide = new EventEmitter<OutputReturnWrapper<JQuery>>();
    @Output() onHidden = new EventEmitter<JQuery>();
    @Output() onUnplaceable = new EventEmitter<JQuery>();

    @Input() className = {
        active: 'active',
        animating: 'animating',
        dropdown: 'dropdown',
        fluid: 'fluid',
        loading: 'loading',
        position: 'top left center bottom right',
        visible: 'visible',
        popupVisible: 'visible'
    };

    @Input('className.active') classNameActive: string;
    @Input('className.animating') classNameAnimating: string;
    @Input('className.dropdown') classNameDropdown: string;
    @Input('className.fluid') classNameFluid: string;
    @Input('className.loading') classNameLoading: string;
    @Input('className.position') classNamePosition: string;
    @Input('className.visible') classNameVisible: string;
    @Input('className.popupVisible') classNamePopupVisible: string;

    @Input() metadata = {
        activator: 'activator',
        content: 'content',
        html: 'html',
        offset: 'offset',
        position: 'position',
        title: 'title',
        variation: 'variation'
    };

    @Input('metadata.activator') metadataActivator: string;
    @Input('metadata.content') metadataContent: string;
    @Input('metadata.html') metadataHtml: string;
    @Input('metadata.offset') metadataOffset: string;
    @Input('metadata.position') metadataPosition: string;
    @Input('metadata.title') metadataTitle: string;
    @Input('metadata.variation') metadataVariation: string;

    @Input() error = {
        invalidPosition: 'The position you specified is not a valid position',
        cannotPlace: 'Popup does not fit within the boundaries of the viewport',
        method: 'The method you called is not defined.',
        noTransition: 'This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>',
        notFound: 'The target or popup you specified does not exist on the page'
    };

    @Input('error.invalidPosition') errorInvalidPosition: string;
    @Input('error.cannotPlace') errorCannotPlace: string;
    @Input('error.method') errorMethod: string;
    @Input('error.noTransition') errorNoTransition: string;
    @Input('error.notFound') errorNotFound: string;

    @HostListener('click') onClick() {
        if (this.popup instanceof PopupContentComponent
            && this.popup.lastPopup
            && this.popup.lastPopup !== this) {
            // popup 触发源已切换，但上一个触发源没有还原状态
            super.removeClasses(this.popup.lastPopup.eleRef.nativeElement, this.className.visible);

            // 关闭上一个提示框需要延时一段时间 semantic 才能正确识别新状态
            setTimeout(() => {
                let ele = (this.popup as PopupContentComponent).eleRef.nativeElement;
                if (this.isHidden() && !classesContains(ele, this.className.animating + ' in')) {
                    this.show();
                }
            }, (this.duration || 0) + (this.delay.hide || 0) + (this.delay.show || 0));
        }
    }

    constructor(private eleRef: ElementRef,
                renderer: Renderer2) {
        super(renderer);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.position && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
        if (isNotFirstChange(changes.position)) {
            this.setPosition(this.position);
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        this.ctrl = $(this.eleRef.nativeElement).popup(
            $.extend(true, {}, this.options, {
                popup: this.popup instanceof PopupContentComponent ? this.popup.eleRef.nativeElement : this.popup,
                exclusive: this.exclusive,
                movePopup: this.movePopup,
                observeChanges: this.observeChanges,
                boundary: this.boundary,
                context: this.context,
                scrollContext: this.scrollContext,
                jitter: this.jitter,
                position: this.position,
                inline: this.inline,
                preserve: this.preserve,
                prefer: this.prefer,
                lastResort: this.lastResort,
                on: this.on,
                delay: this.delay,
                transition: this.transition,
                duration: this.duration,
                setFluidWidth: this.setFluidWidth,
                hoverable: this.hoverable,
                closable: this.closable,
                addTouchEvents: this.addTouchEvents,
                hideOnScroll: this.hideOnScroll,
                target: this.target,
                distanceAway: this.distanceAway,
                offset: this.offset,
                maxSearchDepth: this.maxSearchDepth,
                variation: this.variation,
                content: this.content,
                title: this.title,
                html: this.html,

                onCreate: (module: JQuery) => this.onCreate.emit(module),
                onRemove: (module: JQuery) => this.onRemove.emit(module),
                onShow: (module: JQuery) => {
                    let returnValue = null;
                    this.onShow.emit((cb: Function | any) => {
                        returnValue = typeof cb === 'function' ? cb(module) : !!cb;
                    });

                    return returnValue !== false;
                },
                onVisible: (module: JQuery) => {
                    // 共享 popup 切换时有 bug，记录当前触发组件，在下一个组件触发前还原状态
                    if (this.popup instanceof PopupContentComponent) {
                        this.popup.lastPopup = this;
                    }

                    this.onVisible.emit(module);
                },
                onHide: (module: JQuery) => {
                    let returnValue = null;
                    this.onHide.emit((cb: Function | any) => {
                        returnValue = typeof cb === 'function' ? cb(module) : !!cb;
                    });

                    return returnValue !== false;
                },
                onHidden: (module: JQuery) => {
                    if (this.popup instanceof PopupContentComponent) {
                        this.popup.lastPopup = null;
                    }

                    this.onHidden.emit(module);
                },
                onUnplaceable: (module: JQuery) => this.onUnplaceable.emit(module),

                className: this.className,
                metadata: this.metadata,
                error: this.error,

                silent: this.silent,
                debug: this.debug,
                performance: this.performance,
                verbose: this.verbose
            })
        );
    }

    show() {
        this.ctrl$.subscribe(() => {
            this.ctrl.popup('show');
        });
    }

    hide() {
        this.ctrl$.subscribe(() => {
            this.ctrl.popup('hide');
        });
    }

    hideAll() {
        this.ctrl$.subscribe(() => this.ctrl.popup('hide all'));
    }

    getPopup() {
        return this.ctrl$.pipe(map(() => this.ctrl.popup('get popup')));
    }

    getPopupSync() {
        return this.ctrl ? this.ctrl.popup('get popup') : null;
    }

    changeContent(html: string | false) {
        this.ctrl$.subscribe(() => {
            if (this.ctrl && html) {
                this.ctrl.popup('change content', html);
            }
        });
    }

    toggle() {
        this.ctrl$.subscribe(() => this.ctrl.popup('toggle'));
    }

    isVisible() {
        return this.ctrl$.pipe(map(() => this.ctrl.popup('is visible')));
    }

    isVisibleSync() {
        return this.ctrl ? this.ctrl.popup('is visible') : null;
    }

    isHidden() {
        return this.ctrl$.pipe(map(() => this.ctrl.popup('is hidden')));
    }

    isHiddenSync() {
        return this.ctrl ? this.ctrl.popup('is hidden') : null;
    }

    exists() {
        return this.ctrl$.pipe(map(() => this.ctrl.popup('exists')));
    }

    existsSync() {
        return this.ctrl ? this.ctrl.popup('exists') : null;
    }

    reposition() {
        this.ctrl$.subscribe(() => this.ctrl.popup('reposition'));
    }

    setPosition(position: string) {
        this.ctrl$.subscribe(() => this.ctrl.popup('set position', position));
    }

    destroy() {
        this.ctrl$.subscribe(() => this.ctrl.popup('destroy'));
    }

    removePopup() {
        this.ctrl$.subscribe(() => this.ctrl.popup('remove popup'));
    }
}