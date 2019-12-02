import { ChangeDetectionStrategy, Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
    selector: 'sm-accordion-title',
    template: '<ng-content></ng-content>',
    styleUrls: [ '../base.less' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionTitleComponent {

    constructor(private eleRef: ElementRef,
                private renderer: Renderer2) {
        this.renderer.addClass(this.eleRef.nativeElement, 'title');
    }
}