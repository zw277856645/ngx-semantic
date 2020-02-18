import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule } from '@angular/core';
import { AccordionComponent } from './accordion/accordion.component';
import { AccordionItemComponent } from './accordion/accordion-item.component';
import { AccordionTitleComponent } from './accordion/accordion-title.component';
import { AccordionContentComponent } from './accordion/accordion-content.component';
import { ProgressComponent } from './progress/progress.component';
import { DimmerComponent } from './dimmer/dimmer.component';
import { TabsComponent } from './tab/tabs.component';
import { TabComponent } from './tab/tab.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ToggleComponent } from './checkbox/toggle.component';
import { RadioComponent } from './checkbox/radio.component';
import { TransitionDirective } from './transition/transition.directive';
import { SliderComponent } from './checkbox/slider.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { DialogComponent } from './modal/dialog.component';
import { PopupDirective } from './popup/popup.directive';
import { PopupContentComponent } from './popup/popup-content.component';
import { TooltipComponent } from './popup/tooltip.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CmjsLibModule } from '@demacia/cmjs-lib';
import { ShapeComponent } from './shape/shape.component';
import { ShapeItemComponent } from './shape/shape-item.component';
import { SearchComponent } from './search/search.component';

const MODULES = [
    CommonModule,
    CmjsLibModule
];

const COMPONENTS = [
    AccordionComponent,
    AccordionItemComponent,
    AccordionTitleComponent,
    AccordionContentComponent,

    ProgressComponent,

    DimmerComponent,

    TabsComponent,
    TabComponent,

    SidebarComponent,

    CheckboxComponent,
    ToggleComponent,
    RadioComponent,
    SliderComponent,

    ModalComponent,
    DialogComponent,

    TransitionDirective,

    PopupDirective,
    PopupContentComponent,
    TooltipComponent,

    DropdownComponent,

    ShapeComponent,
    ShapeItemComponent,

    SearchComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ],
    exports: [
        ...MODULES,
        ...COMPONENTS
    ]
})
export class SemanticModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SemanticModule,
            providers: [
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: DialogComponent,
                    multi: true
                }
            ]
        };
    }
}