import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges
} from '@angular/core';
import { InputBoolean, InputNumber } from '@demacia/cmjs-lib';
import { isNotFirstChanges } from '../utils';

@Component({
    selector: '[smTooltip]',
    template: '<ng-content></ng-content>',
    styleUrls: [ './tooltip.component.less' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent implements AfterViewInit, OnChanges {

    @Input() @InputBoolean() useJavascript = false;
    @Input() @InputNumber() distanceAway = 0;
    @Input() @InputNumber() offset = 0;
    @Input() position = 'top center';
    @Input() variation = 'mini inverted basic';
    @Input() content: string;
    @Input() @InputBoolean() inline = false;

    constructor(private eleRef: ElementRef,
                public renderer: Renderer2) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
    }

    ngAfterViewInit() {
        if (!this.useJavascript) {
            this.setAttribute('data-tooltip', this.content);
            this.setAttribute('data-position', this.position);
            this.setAttribute('data-variation', this.variation);
        } else {
            $(this.eleRef.nativeElement).popup({
                on: 'hover',
                position: this.position,
                distanceAway: this.distanceAway,
                offset: this.offset,
                variation: this.variation,
                content: this.content,
                inline: this.inline
            });
        }
    }

    private setAttribute(name: string, value: string | number) {
        this.renderer.setAttribute(this.eleRef.nativeElement, name, String(value));
    }
}