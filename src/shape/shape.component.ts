import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges,
    OnDestroy, OnInit, Output, Renderer2, SimpleChanges
} from '@angular/core';
import { Base } from '../base';
import { InputBoolean, InputNumber, waitFor } from '@demacia/cmjs-lib';
import { distinctUntilChanged, map, mapTo, mergeAll, switchMap } from 'rxjs/operators';
import { ElementSelector, isNotFirstChange, isNotFirstChanges } from '../utils';
import { fromEvent, merge, Subscription } from 'rxjs';
import Selector = SemanticUI.Selector;

export type ShapeTransition = 'flip up' | 'flip down' | 'flip right' | 'flip left' | 'flip over' | 'flip back';

@Component({
    selector: 'sm-shape',
    templateUrl: './shape.component.html',
    styleUrls: [ '../base.less' ],
    exportAs: 'shape',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShapeComponent extends Base implements AfterViewInit, OnChanges, OnDestroy, OnInit {

    @Input() transition: ShapeTransition = 'flip up';
    @Input() target: ElementSelector;
    @Input() on = 'click';
    @Input() @InputBoolean() @HostBinding('class.disabled') disabled = false;
    @Input() @InputBoolean() turnBack = true;

    @Input() @InputNumber() duration: number = 700;
    @Input() width: 'auto' | 'initial' | 'next' | number = 'initial';
    @Input() height: 'auto' | 'initial' | 'next' | number = 'initial';

    /* tslint:disable:no-output-on-prefix */

    @Output() beforeChange = new EventEmitter();
    @Output() onChange = new EventEmitter();

    @Input() error = {
        side: 'You tried to switch to a side that does not exist.',
        method: 'The method you called is not defined'
    };

    @Input('error.side') errorSide: string;
    @Input('error.method') errorMethod: string;

    @Input() className = {
        animating: 'animating',
        hidden: 'hidden',
        loading: 'loading',
        active: 'active'
    };

    @Input('className.animating') classNameAnimating: string;
    @Input('className.hidden') classNameHidden: string;
    @Input('className.loading') classNameLoading: string;
    @Input('className.active') classNameActive: string;

    private subscription = new Subscription();

    constructor(private eleRef: ElementRef,
                renderer: Renderer2) {
        super(renderer);
        super.addClasses(this.eleRef.nativeElement, 'ui shape');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.transition
            && !changes.target
            && !changes.on
            && !changes.disabled
            && !changes.turnBack
            && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
        if (isNotFirstChange(changes.target) || isNotFirstChange(changes.on)) {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            this.ngOnInit();
        }
    }

    ngOnInit() {
        if (this.on === 'hover') {
            let sources = [
                fromEvent($(this.target)[ 0 ] || this.eleRef.nativeElement, 'mouseenter').pipe(mapTo(this.transition)),
                fromEvent($(this.target)[ 0 ] || this.eleRef.nativeElement, 'mouseleave').pipe(map(() => {
                    if (this.turnBack) {
                        return this.getOppositeTransition();
                    }
                }))
            ];

            this.subscription.add(
                merge(sources)
                    .pipe(
                        mergeAll(),
                        switchMap(transition => waitFor(() => !this.isAnimatingSync()).pipe(mapTo(transition))),
                        distinctUntilChanged()
                    )
                    .subscribe(transition => {
                        if (!this.disabled) {
                            this.doAction(transition);
                        }
                    })
            );
        } else {
            this.subscription.add(
                fromEvent($(this.target)[ 0 ] || this.eleRef.nativeElement, this.on).subscribe(() => {
                    if (!this.disabled) {
                        this.doAction(this.transition);
                    }
                })
            );
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        this.ctrl = $(this.eleRef.nativeElement).shape(
            $.extend(true, {}, this.options, {
                duration: this.duration,
                width: this.width,
                height: this.height,

                beforeChange: () => this.beforeChange.emit(),
                onChange: () => this.onChange.emit(),

                className: this.className,
                error: this.error,

                silent: this.silent,
                debug: this.debug,
                performance: this.performance,
                verbose: this.verbose
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    flipUp() {
        this.ctrl$.subscribe(() => this.ctrl.shape('flip up'));
    }

    flipDown() {
        this.ctrl$.subscribe(() => this.ctrl.shape('flip down'));
    }

    flipRight() {
        this.ctrl$.subscribe(() => this.ctrl.shape('flip right'));
    }

    flipLeft() {
        this.ctrl$.subscribe(() => this.ctrl.shape('flip left'));
    }

    flipOver() {
        this.ctrl$.subscribe(() => this.ctrl.shape('flip over'));
    }

    flipBack() {
        this.ctrl$.subscribe(() => this.ctrl.shape('flip back'));
    }

    setNextSide(selector: Selector) {
        this.ctrl$.subscribe(() => this.ctrl.shape('set next side', selector));
    }

    isAnimating() {
        return this.ctrl$.pipe(map(() => this.ctrl.shape('is animating')));
    }

    isAnimatingSync() {
        return this.ctrl ? this.ctrl.shape('is animating') : null;
    }

    reset() {
        this.ctrl$.subscribe(() => this.ctrl.shape('reset'));
    }

    queue(animation: string) {
        this.ctrl$.subscribe(() => this.ctrl.shape('queue', animation));
    }

    repaint() {
        this.ctrl$.subscribe(() => this.ctrl.shape('repaint'));
    }

    setDefaultSide() {
        this.ctrl$.subscribe(() => this.ctrl.shape('set default side'));
    }

    setStageSize() {
        this.ctrl$.subscribe(() => this.ctrl.shape('set stage size'));
    }

    refresh() {
        this.ctrl$.subscribe(() => this.ctrl.shape('refresh'));
    }

    getTransformDown() {
        return this.ctrl$.pipe(map(() => this.ctrl.shape('get transform down')));
    }

    getTransformDownSync() {
        return this.ctrl ? this.ctrl.shape('get transform down') : null;
    }

    getTransformUp() {
        return this.ctrl$.pipe(map(() => this.ctrl.shape('get transform up')));
    }

    getTransformUpSync() {
        return this.ctrl ? this.ctrl.shape('get transform up') : null;
    }

    getTransformLeft() {
        return this.ctrl$.pipe(map(() => this.ctrl.shape('get transform left')));
    }

    getTransformLeftSync() {
        return this.ctrl ? this.ctrl.shape('get transform left') : null;
    }

    getTransformRight() {
        return this.ctrl$.pipe(map(() => this.ctrl.shape('get transform right')));
    }

    getTransformRightSync() {
        return this.ctrl ? this.ctrl.shape('get transform right') : null;
    }

    private doAction(transition: ShapeTransition) {
        switch (transition) {
            case 'flip up':
                this.flipUp();
                break;
            case 'flip down':
                this.flipDown();
                break;
            case 'flip right':
                this.flipRight();
                break;
            case 'flip left':
                this.flipLeft();
                break;
            case 'flip over':
                this.flipOver();
                break;
            case 'flip back':
                this.flipBack();
        }
    }

    private getOppositeTransition() {
        switch (this.transition) {
            case 'flip up':
                return 'flip down';
            case 'flip down':
                return 'flip up';
            case 'flip right':
                return 'flip left';
            case 'flip left':
                return 'flip right';
            case 'flip over':
                return 'flip back';
            case 'flip back':
                return 'flip over';
        }
    }

}