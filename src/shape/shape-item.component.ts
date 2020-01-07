import { ChangeDetectionStrategy, Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
    selector: 'sm-shape-item',
    template: '<ng-content></ng-content>',
    styleUrls: [ '../base.less' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShapeItemComponent {

    constructor(private eleRef: ElementRef,
                private renderer: Renderer2) {
        this.renderer.addClass(this.eleRef.nativeElement, 'side');
    }
}