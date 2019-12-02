import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild
} from '@angular/core';
import { InputBoolean } from '@demacia/cmjs-lib';
import { ModalComponent } from './modal.component';

@Component({
    templateUrl: './dialog.component.html',
    styleUrls: [ '../base.less' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent extends ModalComponent implements OnInit, AfterViewInit {

    @ViewChild('defaultTemplate', { static: true }) @Input() template: TemplateRef<any>;

    @Input() title: string;
    @Input() content: string;
    @Input() approveText: string;
    @Input() cancelText: string;
    @Input() @InputBoolean() showCancel: boolean;
    @Input() variation: string;

    @Input() set event(event: Event) {
        if (event) {
            this.eventSources = [ event ];
        } else {
            this.eventSources = [];
        }
    }

    constructor(renderer: Renderer2,
                public eleRef: ElementRef) {
        super(renderer, eleRef);
    }

    ngOnInit() {
        if (this.variation) {
            super.addClasses(this.eleRef.nativeElement, this.variation);
        }
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        super.show();
    }

    get templateContext() {
        return {
            title: this.title,
            content: this.content,
            approveText: this.approveText,
            cancelText: this.cancelText,
            showCancel: this.showCancel
        };
    }
}