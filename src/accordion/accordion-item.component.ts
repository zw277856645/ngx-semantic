import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'sm-accordion-item',
    template: '<ng-content></ng-content>',
    styleUrls: [ '../base.less' ],
    styles: [ `
      :host:first-child ::ng-deep > .title {
        border-top: none !important;
      }
    ` ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionItemComponent {
}