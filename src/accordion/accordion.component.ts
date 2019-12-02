import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2,
    SimpleChanges
} from '@angular/core';
import { InputBoolean, InputNumber, waitFor } from '@demacia/cmjs-lib';
import { classesContains, isNotFirstChange, isNotFirstChanges } from '../utils';
import { Base } from '../base';

@Component({
    selector: 'sm-accordion',
    template: '<ng-content></ng-content>',
    styleUrls: [ '../base.less' ],
    exportAs: 'accordion',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent extends Base implements AfterViewInit, OnChanges {

    @Input() @InputNumber(null) activeIndex: number;
    @Output() activeIndexChange = new EventEmitter<number>();

    @Input() @InputBoolean() exclusive = true;
    @Input() on = 'click';
    @Input() @InputBoolean() animateChildren = true;
    @Input() @InputBoolean() closeNested = true;
    @Input() @InputBoolean() collapsible = true;
    @Input() @InputNumber() duration = 500;
    @Input() easing = 'easeOutQuad';

    /* tslint:disable:no-output-on-prefix */

    @Output() onOpening = new EventEmitter();
    @Output() onOpen = new EventEmitter();
    @Output() onClosing = new EventEmitter();
    @Output() onClose = new EventEmitter();
    @Output() onChange = new EventEmitter();

    @Input() selector = {
        title: '.title',
        trigger: '.title',
        content: '.content'
    };

    @Input('selector.title') selectorTitle: string;
    @Input('selector.trigger') selectorTrigger: string;
    @Input('selector.content') selectorContent: string;

    @Input() className = {
        active: 'active',
        animating: 'animating'
    };

    @Input('className.active') classNameActive: string;
    @Input('className.animating') classNameAnimating: string;

    @Input() error = {
        method: 'The method you called is not defined.'
    };

    @Input('error.method') errorMethod: string;

    constructor(private eleRef: ElementRef,
                renderer: Renderer2) {
        super(renderer);
        super.addClasses(this.eleRef.nativeElement, 'ui accordion');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.activeIndex && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
        if (isNotFirstChange(changes.activeIndex)) {
            this.open(this.activeIndex);
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        this.ctrl = $(this.eleRef.nativeElement).accordion(
            $.extend(true, {}, this.options, {
                exclusive: this.exclusive,
                on: this.on,
                animateChildren: this.animateChildren,
                closeNested: this.closeNested,
                collapsible: this.collapsible,
                duration: this.duration,
                easing: this.easing,

                onOpening: () => this.onOpening.emit(),
                onOpen: () => {
                    this.activeIndex = this.getActiveIndex();
                    this.activeIndexChange.emit(this.activeIndex);
                    this.onOpen.emit();
                },
                onClosing: () => this.onClosing.emit(),
                onClose: () => {
                    this.activeIndex = null;
                    this.activeIndexChange.emit();
                    this.onClose.emit();
                },
                onChange: () => this.onChange.emit(),

                selector: this.selector,
                className: this.className,
                error: this.error,

                silent: this.silent,
                debug: this.debug,
                performance: this.performance,
                verbose: this.verbose
            })
        );

        if (this.activeIndex !== null && this.activeIndex !== undefined) {
            // 可能内容还没加载好，等待加载完成
            waitFor(() => (this.eleRef.nativeElement as HTMLElement).childElementCount > 0)
                .subscribe(() => this.open(this.activeIndex));
        }
    }

    refresh() {
        this.ctrl$.subscribe(() => this.ctrl.accordion('refresh'));
    }

    open(index: number) {
        this.ctrl$.subscribe(() => this.ctrl.accordion('open', index));
    }

    close(index: number) {
        this.ctrl$.subscribe(() => this.ctrl.accordion('close', index));
    }

    closeOthers() {
        this.ctrl$.subscribe(() => this.ctrl.accordion('close others'));
    }

    toggle(index: number) {
        this.ctrl$.subscribe(() => this.ctrl.accordion('toggle', index));
    }

    private getActiveIndex() {
        let titles = (this.eleRef.nativeElement as HTMLElement).querySelectorAll(this.selector.title);
        if (titles && titles.length) {
            for (let i = 0, len = titles.length; i < len; i++) {
                if (classesContains(titles.item(i), this.className.active)) {
                    return i;
                }
            }
        }

        return null;
    }

}