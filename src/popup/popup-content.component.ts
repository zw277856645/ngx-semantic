import { ChangeDetectionStrategy, Component, ElementRef, Renderer2 } from '@angular/core';
import { Base } from '../base';
import { PopupDirective } from './popup.directive';

@Component({
    selector: 'sm-popup-content',
    template: '<ng-content></ng-content>',
    styleUrls: [ '../base.less' ],
    styles: [ `
      :host(.mini.inverted) {
        font-size: 0.85714286rem;
        padding: .25em .55em;
      }
    ` ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupContentComponent {

    lastPopup: PopupDirective;

    constructor(public eleRef: ElementRef,
                private renderer: Renderer2) {
        Base.addClasses(this.renderer, this.eleRef.nativeElement, 'ui popup');
    }
}