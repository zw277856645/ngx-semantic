import { Component, ElementRef, HostBinding, Input, Renderer2, TemplateRef } from '@angular/core';
import { Base } from '../base';
import { uuid } from '@demacia/cmjs-lib';

@Component({
    selector: 'sm-tab',
    templateUrl: './tab.component.html',
    styleUrls: [ '../base.less' ]
})
export class TabComponent {

    @HostBinding('attr.data-tab') @Input() tabName = uuid(8);

    @Input() label: string | TemplateRef<any>;
    @Input() content: TemplateRef<any>;
    @Input() class: string;

    active: boolean;

    constructor(private eleRef: ElementRef,
                private renderer: Renderer2) {
        Base.addClasses(this.renderer, this.eleRef.nativeElement, 'ui tab');
    }

}