import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2,
    SimpleChanges
} from '@angular/core';
import { Base } from '../base';
import { InputBoolean, InputNumber } from '@demacia/cmjs-lib';
import { ElementSelector, isNotFirstChange, isNotFirstChanges } from '../utils';
import { map } from 'rxjs/operators';

@Component({
    selector: 'sm-sidebar',
    template: '<ng-content></ng-content>',
    styleUrls: [ '../base.less' ],
    exportAs: 'sidebar',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent extends Base implements OnChanges, AfterViewInit {

    @Input() @InputBoolean() visible: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() context: ElementSelector = 'body';
    @Input() @InputBoolean() exclusive = false;
    @Input() @InputBoolean() closable = true;
    @Input() @InputBoolean() dimPage = true;
    @Input() @InputBoolean() scrollLock = false;
    @Input() @InputBoolean() returnScroll = false;
    @Input() @InputBoolean() delaySetup = false;
    @Input() transition = 'auto';
    @Input() mobileTransition = 'auto';
    @Input() @InputNumber() duration = 500;

    @Input() defaultTransition = {
        computer: {
            left: 'uncover',
            right: 'uncover',
            top: 'overlay',
            bottom: 'overlay'
        },
        mobile: {
            left: 'uncover',
            right: 'uncover',
            top: 'overlay',
            bottom: 'overlay'
        }
    };

    @Input('defaultTransition.computer') defaultTransitionComputer: any;
    @Input('defaultTransition.computer.left') defaultTransitionComputerLeft: string;
    @Input('defaultTransition.computer.right') defaultTransitionComputerRight: string;
    @Input('defaultTransition.computer.top') defaultTransitionComputerTop: string;
    @Input('defaultTransition.computer.bottom') defaultTransitionComputerBottom: string;

    @Input('defaultTransition.mobile') defaultTransitionMobile: any;
    @Input('defaultTransition.mobile.left') defaultTransitionMobileLeft: string;
    @Input('defaultTransition.mobile.right') defaultTransitionMobileRight: string;
    @Input('defaultTransition.mobile.top') defaultTransitionMobileTop: string;
    @Input('defaultTransition.mobile.bottom') defaultTransitionMobileBottom: string;

    /* tslint:disable:no-output-on-prefix */

    @Output() onChange = new EventEmitter();
    @Output() onShow = new EventEmitter();
    @Output() onHide = new EventEmitter();
    @Output() onHidden = new EventEmitter();
    @Output() onVisible = new EventEmitter();

    @Input() className = {
        active: 'active',
        animating: 'animating',
        dimmed: 'dimmed',
        ios: 'ios',
        pushable: 'pushable',
        pushed: 'pushed',
        right: 'right',
        top: 'top',
        left: 'left',
        bottom: 'bottom',
        visible: 'visible'
    };

    @Input('className.active') classNameActive: string;
    @Input('className.animating') classNameAnimating: string;
    @Input('className.dimmed') classNameDimmed: string;
    @Input('className.ios') classNameIos: string;
    @Input('className.pushable') classNamePushable: string;
    @Input('className.pushed') classNamePushed: string;
    @Input('className.right') classNameRight: string;
    @Input('className.top') classNameTop: string;
    @Input('className.left') classNameLeft: string;
    @Input('className.bottom') classNameBottom: string;
    @Input('className.visible') classNameVisible: string;

    @Input() selector = {
        fixed: '.fixed',
        omitted: 'script, link, style, .ui.modal, .ui.dimmer, .ui.nag, .ui.fixed',
        pusher: '.pusher'
    };

    @Input('selector.fixed') selectorFixed: string;
    @Input('selector.omitted') selectorOmitted: string;
    @Input('selector.pusher') selectorPusher: string;

    @Input() regExp = {
        ios: /(iPad|iPhone|iPod)/g,
        mobileChrome: /(CriOS)/g,
        // tslint:disable-next-line:max-line-length
        mobile: /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/g
    };

    @Input('regExp.ios') regExpIos: RegExp;
    @Input('regExp.mobileChrome') regExpMobileChrome: RegExp;
    @Input('regExp.mobile') regExpMobile: RegExp;

    @Input() error = {
        method: 'The method you called is not defined.',
        pusher: 'Had to add pusher element. For optimal performance make sure body content is inside a pusher element',
        movedSidebar: 'Had to move sidebar. For optimal performance make sure sidebar and pusher are direct children'
            + ' of your body tag',
        overlay: 'The overlay setting is no longer supported, use animation: overlay',
        notFound: 'There were no elements that matched the specified selector'
    };

    @Input('error.method') errorMethod: string;
    @Input('error.pusher') errorPusher: string;
    @Input('error.movedSidebar') errorMovedSidebar: string;
    @Input('error.overlay') errorOverlay: string;
    @Input('error.notFound') errorNotFound: string;

    constructor(renderer: Renderer2,
                private eleRef: ElementRef) {
        super(renderer);
        super.addClasses(this.eleRef.nativeElement, 'ui sidebar');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.visible && isNotFirstChanges(changes)) {
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

        this.ctrl = $(this.eleRef.nativeElement).sidebar(
            $.extend(true, {}, this.options, {
                context: this.context,
                exclusive: this.exclusive,
                closable: this.closable,
                dimPage: this.dimPage,
                scrollLock: this.scrollLock,
                returnScroll: this.returnScroll,
                delaySetup: this.delaySetup,
                transition: this.transition,
                mobileTransition: this.mobileTransition,
                duration: this.duration,
                defaultTransition: this.defaultTransition,

                onChange: () => this.onChange.emit(),
                onShow: () => this.onShow.emit(),
                onHide: () => this.onHide.emit(),
                onVisible: () => {
                    this.visible = true;
                    this.visibleChange.emit(true);
                    this.onVisible.emit();
                },
                onHidden: () => {
                    this.visible = false;
                    this.visibleChange.emit(false);
                    this.onHidden.emit();
                },

                regExp: this.regExp,
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

    attachEvents(selector: string, events?: any) {
        this.ctrl$.subscribe(() => this.ctrl.sidebar('attach events', selector, events));
    }

    show() {
        this.ctrl$.subscribe(() => this.ctrl.sidebar('show'));
    }

    hide() {
        this.ctrl$.subscribe(() => this.ctrl.sidebar('hide'));
    }

    toggle() {
        this.ctrl$.subscribe(() => this.ctrl.sidebar('toggle'));
    }

    isVisible() {
        return this.ctrl$.pipe(map(() => this.ctrl.sidebar('is visible')));
    }

    isVisibleSync() {
        return this.ctrl ? this.ctrl.sidebar('is visible') : null;
    }

    isHidden() {
        return this.ctrl$.pipe(map(() => this.ctrl.sidebar('is hidden')));
    }

    isHiddenSync() {
        return this.ctrl ? this.ctrl.sidebar('is hidden') : null;
    }

    pushPage() {
        this.ctrl$.subscribe(() => this.ctrl.sidebar('push page'));
    }

    getDirection() {
        return this.ctrl$.pipe(map(() => this.ctrl.sidebar('get direction')));
    }

    getDirectionSync() {
        return this.ctrl ? this.ctrl.sidebar('get direction') : null;
    }

    pullPage() {
        this.ctrl$.subscribe(() => this.ctrl.sidebar('pull page'));
    }

    addBodyCSS() {
        this.ctrl$.subscribe(() => this.ctrl.sidebar('add body CSS'));
    }

    removeBodyCSS() {
        this.ctrl$.subscribe(() => this.ctrl.sidebar('remove body CSS'));
    }

    getTransitionEvents() {
        return this.ctrl ? this.ctrl.sidebar('get transition event') : null;
    }

    getTransitionEventsSync() {
        return this.ctrl ? this.ctrl.sidebar('get transition event') : null;
    }
}