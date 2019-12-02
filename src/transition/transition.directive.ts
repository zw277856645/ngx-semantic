import {
    AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges
} from '@angular/core';
import { Base } from '../base';
import { InputBoolean, InputNumber } from '@demacia/cmjs-lib';
import { isNotFirstChange, isNotFirstChanges } from '../utils';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[smTransition]',
    exportAs: 'transition'
})
export class TransitionDirective extends Base implements AfterViewInit, OnChanges {

    @Input() animation: string | false = false;
    @Input() @InputNumber() interval = 0;
    @Input() reverse: any = 'auto';
    @Input() displayType: string | false = false;
    @Input() duration: number | false = false;
    @Input() @InputBoolean() useFailSafe = true;
    @Input() @InputNumber() failSafeDelay = 100;
    @Input() @InputBoolean() allowRepeats = false;
    @Input() @InputBoolean() queue = true;

    /* tslint:disable:no-output-on-prefix */

    @Output() onStart = new EventEmitter();
    @Output() onComplete = new EventEmitter();
    @Output() onShow = new EventEmitter();
    @Output() onHide = new EventEmitter();

    @Input() className = {
        animating: 'animating',
        disabled: 'disabled',
        hidden: 'hidden',
        inward: 'in',
        loading: 'loading',
        looping: 'looping',
        outward: 'out',
        transition: 'transition',
        visible: 'visible'
    };

    @Input('className.animating') classNameAnimating: string;
    @Input('className.disabled') classNameDisabled: string;
    @Input('className.hidden') classNameHidden: string;
    @Input('className.inward') classNameInward: string;
    @Input('className.loading') classNameLoading: string;
    @Input('className.looping') classNameLooping: string;
    @Input('className.outward') classNameOutward: string;
    @Input('className.transition') classNameTransition: string;
    @Input('className.visible') classNameVisible: string;

    @Input() error = {
        noAnimation: 'There is no CSS animation matching the one you specified.',
        repeated: 'That animation is already occurring, cancelling repeated animation',
        method: 'The method you called is not defined',
        support: 'This browser does not support CSS animations'
    };

    @Input('error.noAnimation') errorNoAnimation: string;
    @Input('error.repeated') errorRepeated: string;
    @Input('error.method') errorMethod: string;
    @Input('error.support') errorSupport: string;

    constructor(private eleRef: ElementRef,
                renderer: Renderer2) {
        super(renderer);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.duration && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
        if (isNotFirstChange(changes.duration) && typeof this.duration === 'number') {
            this.setDuration(this.duration);
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        if (this.animation) {
            this.ctrl = $(this.eleRef.nativeElement).transition(
                $.extend(true, {}, this.options, {
                    animation: this.animation,
                    interval: this.interval,
                    reverse: this.reverse,
                    displayType: this.displayType,
                    duration: this.duration,
                    useFailSafe: this.useFailSafe,
                    failSafeDelay: this.failSafeDelay,
                    allowRepeats: this.allowRepeats,
                    queue: this.queue,

                    onStart: () => this.onStart.emit(),
                    onComplete: () => this.onComplete.emit(),
                    onShow: () => this.onShow.emit(),
                    onHide: () => this.onHide.emit(),

                    className: this.className,
                    error: this.error,

                    silent: this.silent,
                    debug: this.debug,
                    performance: this.performance,
                    verbose: this.verbose
                })
            );
        }
    }

    stop() {
        this.ctrl$.subscribe(() => this.ctrl.transition('stop'));
    }

    stopAll() {
        this.ctrl$.subscribe(() => this.ctrl.transition('stop all'));
    }

    clearQueue() {
        this.ctrl$.subscribe(() => this.ctrl.transition('clear queue'));
    }

    show() {
        this.ctrl$.subscribe(() => this.ctrl.transition('show'));
    }

    hide() {
        this.ctrl$.subscribe(() => this.ctrl.transition('hide'));
    }

    toggle() {
        this.ctrl$.subscribe(() => this.ctrl.transition('toggle'));
    }

    forceRepaint() {
        this.ctrl$.subscribe(() => this.ctrl.transition('force repaint'));
    }

    repaint() {
        this.ctrl$.subscribe(() => this.ctrl.transition('repaint'));
    }

    reset() {
        this.ctrl$.subscribe(() => this.ctrl.transition('reset'));
    }

    looping() {
        this.ctrl$.subscribe(() => this.ctrl.transition('looping'));
    }

    removeLooping() {
        this.ctrl$.subscribe(() => this.ctrl.transition('remove looping'));
    }

    disable() {
        this.ctrl$.subscribe(() => this.ctrl.transition('disable'));
    }

    enable() {
        this.ctrl$.subscribe(() => this.ctrl.transition('enable'));
    }

    setDuration(duration: number) {
        this.ctrl$.subscribe(() => this.ctrl.transition('set duration', duration));
    }

    saveConditions() {
        this.ctrl$.subscribe(() => this.ctrl.transition('save conditions'));
    }

    restoreConditions() {
        this.ctrl$.subscribe(() => this.ctrl.transition('restore conditions'));
    }

    getAnimationName() {
        return this.ctrl$.pipe(map(() => this.ctrl.transition('get animation name')));
    }

    getAnimationNameSync() {
        return this.ctrl ? this.ctrl.transition('get animation name') : null;
    }

    getAnimationEvent() {
        return this.ctrl$.pipe(map(() => this.ctrl.transition('get animation event')));
    }

    getAnimationEventSync() {
        return this.ctrl ? this.ctrl.transition('get animation event') : null;
    }

    isVisible() {
        return this.ctrl$.pipe(map(() => this.ctrl.transition('is visible')));
    }

    isVisibleSync() {
        return this.ctrl ? this.ctrl.transition('is visible') : null;
    }

    isAnimating() {
        return this.ctrl$.pipe(map(() => this.ctrl.transition('is animating')));
    }

    isAnimatingSync() {
        return this.ctrl ? this.ctrl.transition('is animating') : null;
    }

    isLooping() {
        return this.ctrl$.pipe(map(() => this.ctrl.transition('is looping')));
    }

    isLoopingSync() {
        return this.ctrl ? this.ctrl.transition('is looping') : null;
    }

    isSupported() {
        return this.ctrl$.pipe(map(() => this.ctrl.transition('is supported')));
    }

    isSupportedSync() {
        return this.ctrl ? this.ctrl.transition('is supported') : null;
    }
}