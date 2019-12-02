import { ChangeDetectionStrategy, Component, ElementRef, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SliderComponent } from './slider.component';

@Component({
    selector: 'sm-toggle',
    templateUrl: './slider.component.html',
    styleUrls: [ '../base.less' ],
    exportAs: 'toggle',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ToggleComponent,
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent extends SliderComponent {

    constructor(eleRef: ElementRef,
                renderer: Renderer2) {
        super(eleRef, renderer);
        super.addClasses(eleRef.nativeElement, 'toggle');
        renderer.removeClass(eleRef.nativeElement, 'slider');
    }
}