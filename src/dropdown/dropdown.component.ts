import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges,
    Output, Renderer2, SimpleChanges, TemplateRef, ViewChild
} from '@angular/core';
import { classesContains, ElementSelector, isNotFirstChange, isNotFirstChanges } from '../utils';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputBoolean, InputNumber, waitFor } from '@demacia/cmjs-lib';
import { Base } from '../base';
import { map } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import ApiSettings = SemanticUI.ApiSettings;

type ActionType =
    'activate'
    | 'select'
    | 'combo'
    | 'nothing'
    | 'hide'
    | ((text: string, value: any, ele: any) => any);

@Component({
    selector: 'sm-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: [
        '../base.less',
        './dropdown.component.less'
    ],
    exportAs: 'dropdown',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DropdownComponent,
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent extends Base implements OnChanges, AfterViewInit, ControlValueAccessor {

    @ViewChild('rootMenu', { static: false }) rootMenu: ElementRef;

    @Input() leftIcon: string | TemplateRef<void>;
    @Input() @InputBoolean() showDropdownIcon: boolean;
    @Input() closeIcon: string | TemplateRef<void> = 'remove circle';
    @Input() @InputBoolean() clearable = false;
    @Input() placeholder: string;

    @Input() on = 'click';
    @Input() @InputBoolean() allowReselection = false;
    @Input() @InputBoolean() allowAdditions = false;
    @Input() @InputBoolean() hideAdditions = true;
    @Input() @InputNumber() minCharacters = 0;
    @Input() match: 'both' | 'value' | 'text' = 'both';
    @Input() @InputBoolean() selectOnKeydown = true;
    @Input() @InputBoolean() forceSelection = true;
    @Input() @InputBoolean() allowCategorySelection = false;
    @Input() action: ActionType = 'activate';
    @Input() apiSettings: false | ApiSettings = false;
    @Input() @InputBoolean() saveRemoteData = true;
    @Input() direction: 'auto' | 'upward' | 'downward' = 'auto';
    @Input() @InputBoolean() keepOnScreen = true;
    @Input() context: ElementSelector | Window = window;
    @Input() fullTextSearch: boolean | 'exact' = 'exact';
    @Input() @InputBoolean() preserveHTML = true;
    @Input() @InputBoolean() sortSelect = false;
    @Input() @InputBoolean() showOnFocus = true;
    @Input() @InputBoolean() allowTab = true;
    @Input() transition = 'auto';
    @Input() @InputNumber() duration = 200;
    @Input() @InputNumber() throttle = 200;
    @Input() @InputBoolean() fireOnInit = false;
    @Input() maxSelections: false | number = false;
    @InputBoolean() @InputNumber() useLabels = true;
    @Input() delimiter = ',';
    @Input() @InputNumber() glyphWidth: 1.037;

    @Input() label = {
        transition: 'scale',
        duration: 200,
        variation: false
    };

    @Input('label.transition') labelTransition: string;
    @Input('label.duration') labelDuration: number;
    @Input('label.variation') labelVariation: string | false;

    @Input() fields = {
        remoteValues: 'results',
        values: 'values',
        disabled: 'disabled',
        name: 'name',
        value: 'value',
        text: 'text'
    };

    @Input('fields.remoteValues') fieldsRemoteValues: string;
    @Input('fields.values') fieldsValues: string;
    @Input('fields.disabled') fieldsDisabled: string;
    @Input('fields.name') fieldsName: string;
    @Input('fields.value') fieldsValue: string;
    @Input('fields.text') fieldsText: string;

    @Input() keys: { [ k: string ]: number } | false = {
        backspace: 8,
        delimiter: 188,
        deleteKey: 46,
        enter: 13,
        escape: 27,
        pageUp: 33,
        pageDown: 34,
        leftArrow: 37,
        upArrow: 38,
        rightArrow: 39,
        downArrow: 40
    };

    @Input('keys.backspace') keysBackspace: number;
    @Input('keys.delimiter') keysDelimiter: number;
    @Input('keys.deleteKey') keysDeleteKey: number;
    @Input('keys.enter') keysEnter: number;
    @Input('keys.escape') keysEscape: number;
    @Input('keys.pageUp') keysPageUp: number;
    @Input('keys.pageDown') keysPageDown: number;
    @Input('keys.leftArrow') keysLeftArrow: number;
    @Input('keys.upArrow') keysUpArrow: number;
    @Input('keys.rightArrow') keysRightArrow: number;
    @Input('keys.downArrow') keysDownArrow: number;

    @Input() delay = {
        hide: 300,
        show: 200,
        search: 20,
        touch: 50
    };

    @Input('delay.hide') delayHide: number;
    @Input('delay.show') delayShow: number;
    @Input('delay.search') delaySearch: number;
    @Input('delay.touch') delayTouch: number;

    /* tslint:disable:no-output-on-prefix */

    @Output() onChange = new EventEmitter<{ value: any, text: string, selected: JQuery }>();
    @Output() onAdd = new EventEmitter<{ value: any, text: string, added: JQuery }>();
    @Output() onRemove = new EventEmitter<{ value: any, text: string, removed: JQuery }>();
    @Output() onLabelSelect = new EventEmitter<JQuery[]>();
    @Output() onLabelCreate = new EventEmitter<{ value: any, text: string }>();
    @Output() onLabelRemove = new EventEmitter<any>();
    @Output() onNoResults = new EventEmitter<any>();
    @Output() onShow = new EventEmitter();
    @Output() onHide = new EventEmitter();

    @Input() message = {
        addResult: 'Add <b>{term}</b>',
        count: '{count} selected',
        maxSelections: 'Max {maxCount} selections',
        noResults: 'No results found.',
        serverError: 'There was an error contacting the server'
    };

    @Input('message.addResult') messageAddResult: string;
    @Input('message.count') messageCount: string;
    @Input('message.maxSelections') messageMaxSelections: string;
    @Input('message.noResults') messageNoResults: string;
    @Input('message.serverError') messageServerError: string;

    @Input() selector = {
        addition: '.addition',
        hidden: '.hidden',
        message: '.message',
        unselectable: '.disabled, .filtered'
    };

    @Input('selector.addition') selectorAddition: string;
    @Input('selector.hidden') selectorHidden: string;
    @Input('selector.message') selectorMessage: string;
    @Input('selector.unselectable') selectorUnselectable: string;

    @Input() regExp = {
        escape: /[-[\]{}()*+?.,\\^$|#\s]/g,
        quote: /"/g
    };

    @Input('regExp.escape') regExpEscape: RegExp;
    @Input('regExp.quote') regExpQuote: RegExp;

    @Input() metadata = {
        defaultText: 'defaultText',
        defaultValue: 'defaultValue',
        text: 'text',
        value: 'value'
    };

    @Input('metadata.defaultText') metadataDefaultText: string;
    @Input('metadata.defaultValue') metadataDefaultValue: string;
    @Input('metadata.text') metadataText: string;
    @Input('metadata.value') metadataValue: string;

    @Input() className = {
        active: 'active',
        addition: 'addition',
        animating: 'animating',
        disabled: 'disabled',
        empty: 'empty',
        filtered: 'filtered',
        hidden: 'hidden transition',
        loading: 'loading',
        message: 'message',
        selected: 'selected',
        selection: 'selection',
        upward: 'upward',
        leftward: 'left',
        multiple: 'multiple'
    };

    @Input('className.active') classNameActive: string;
    @Input('className.addition') classNameAddition: string;
    @Input('className.animating') classNameAnimating: string;
    @Input('className.disabled') classNameDisabled: string;
    @Input('className.empty') classNameEmpty: string;
    @Input('className.filtered') classNameFiltered: string;
    @Input('className.hidden') classNameHidden: string;
    @Input('className.loading') classNameLoading: string;
    @Input('className.message') classNameMessage: string;
    @Input('className.selected') classNameSelected: string;
    @Input('className.selection') classNameSelection: string;
    @Input('className.upward') classNameUpward: string;
    @Input('className.leftward') classNameLeftward: string;
    @Input('className.multiple') classNameMultiple: string;

    @Input() error = {
        action: 'You called a dropdown action that was not defined',
        alreadySetup: 'Once a select has been initialized behaviors must be called on the created ui dropdown',
        labels: 'Allowing user additions currently requires the use of labels.',
        missingMultiple: '<select> requires multiple property to be set to correctly preserve multiple values',
        method: 'The method you called is not defined.',
        noAPI: 'The API module is required to load resources remotely',
        noStorage: 'Saving remote data requires session storage',
        noTransition: 'This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>'
    };

    @Input('error.action') errorAction: string;
    @Input('error.alreadySetup') errorAlreadySetup: string;
    @Input('error.labels') errorLabels: string;
    @Input('error.missingMultiple') errorMissingMultiple: string;
    @Input('error.method') errorMethod: string;
    @Input('error.noAPI') errorNoAPI: string;
    @Input('error.noStorage') errorNoStorage: string;
    @Input('error.noTransition') errorNoTransition: string;

    _value: any;

    private controlChange: Function = new Function();
    private controlTouch: Function = new Function();
    private modelSub: Subscription;

    constructor(private eleRef: ElementRef,
                private cdf: ChangeDetectorRef,
                renderer: Renderer2) {
        super(renderer);
        super.addClasses(this.eleRef.nativeElement, 'ui dropdown');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.showDropdownIcon
            && !changes.leftIcon
            && !changes.clearable
            && !changes.closeIcon
            && !changes.placeholder
            && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
        if (isNotFirstChange(changes.placeholder)) {
            this.setPlaceholder();
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        let flag: any;
        const thiz = this;

        this.ctrl = $(this.eleRef.nativeElement).dropdown(
            $.extend(true, {}, this.options, {
                on: this.on,
                allowReselection: this.allowReselection,
                allowAdditions: this.allowAdditions,
                hideAdditions: this.hideAdditions,
                minCharacters: this.minCharacters,
                match: this.match,
                selectOnKeydown: this.selectOnKeydown,
                forceSelection: this.forceSelection,
                allowCategorySelection: this.allowCategorySelection,
                placeholder: 'auto',
                action: this.action,
                apiSettings: this.apiSettings,
                saveRemoteData: this.saveRemoteData,
                direction: this.direction,
                keepOnScreen: this.keepOnScreen,
                context: this.context,
                fullTextSearch: this.fullTextSearch,
                preserveHTML: this.preserveHTML,
                sortSelect: this.sortSelect,
                showOnFocus: this.showOnFocus,
                allowTab: this.allowTab,
                transition: this.transition,
                duration: this.duration,
                throttle: this.throttle,
                fireOnInit: this.fireOnInit,
                fields: this.fields,
                keys: this.keys,
                delay: this.delay,

                onChange: (value: any, text: string, selected: JQuery) => {
                    // fix：semantic 清除多个值时是每次清除一个值，并触发一次 onChange，导致表单重置(reset)后，
                    // 状态又变为 dirty
                    clearTimeout(flag);
                    flag = setTimeout(() => {
                        if (this._value !== value) {
                            this._value = value;
                            this.onChange.emit({ value, text, selected });

                            this.controlChange(this._value);
                            this.controlTouch(this._value);
                        }
                    });
                },
                onAdd: (value: any, text: string, added: JQuery) => {
                    this.onAdd.emit({ value, text, added });
                },
                onRemove: (value: any, text: string, removed: JQuery) => {
                    this.onRemove.emit({ value, text, removed });
                },
                onLabelSelect: (selectedLabels: JQuery[]) => this.onLabelSelect.emit(selectedLabels),
                // tslint:disable-next-line:object-literal-shorthand
                onLabelCreate: function (value: any, text: string) {
                    thiz.onLabelCreate.emit({ value, text });

                    return $(this);
                },
                onLabelRemove: (value: any) => {
                    thiz.onLabelRemove.emit(value);

                    return true;
                },
                onNoResults: (searchValue: any) => {
                    thiz.onNoResults.emit(searchValue);

                    return true;
                },
                onShow: () => this.onShow.emit(),
                onHide: () => this.onHide.emit(),

                message: this.message,
                selector: this.selector,
                regExp: this.regExp,
                metadata: this.metadata,
                className: this.className,
                error: this.error,

                silent: this.silent,
                debug: this.debug,
                performance: this.performance,
                verbose: this.verbose
            })
        );
    }

    setupMenu() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('setup menu'));
    }

    refresh() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('refresh'));
    }

    toggle() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('toggle'));
    }

    show() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('show'));
    }

    hide() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('hide'));
    }

    clear() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('clear'));
    }

    hideOthers() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('hide others'));
    }

    restoreDefaults() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('restore defaults'));
    }

    restoreDefaultText() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('restore default text'));
    }

    restoreDefaultValue() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('restore default value'));
    }

    saveDefaults() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('save defaults'));
    }

    setSelected(value: any | any[]) {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('set selected', value));
    }

    setExactly(value: any[]) {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('set exactly', value));
    }

    removeSelected(value: any) {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('remove selected', value));
    }

    setText(text: string) {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('set text', text));
    }

    setValue(value: any) {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('set value', value));
    }

    getText() {
        return this.ctrl$.pipe(map(() => this.ctrl.dropdown('get text')));
    }

    getTextSync() {
        return this.ctrl ? this.ctrl.dropdown('get text') : null;
    }

    getValue() {
        return this.ctrl$.pipe(map(() => this.ctrl.dropdown('get value')));
    }

    getValueSync() {
        return this.ctrl ? this.ctrl.dropdown('get value') : null;
    }

    getItem(value: any) {
        return this.ctrl$.pipe(map(() => this.ctrl.dropdown('get item', value)));
    }

    getItemSync(value: any) {
        return this.ctrl ? this.ctrl.dropdown('get item', value) : null;
    }

    bindTouchEvents() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('bind touch events'));
    }

    bindMouseEvents() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('bind mouse events'));
    }

    bindIntent() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('bind intent'));
    }

    unbindIntent() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('unbind intent'));
    }

    determineIntent() {
        return this.ctrl$.pipe(map(() => this.ctrl.dropdown('determine intent')));
    }

    determineIntentSync() {
        return this.ctrl ? this.ctrl.dropdown('determine intent') : null;
    }

    determineSelectAction(text: string, value: any) {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('determine select action', text, value));
    }

    setActive() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('set active'));
    }

    setVisible() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('set visible'));
    }

    removeActive() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('remove active'));
    }

    removeVisible() {
        this.ctrl$.subscribe(() => this.ctrl.dropdown('remove visible'));
    }

    isSelection() {
        return this.ctrl$.pipe(map(() => this.ctrl.dropdown('is selection')));
    }

    isSelectionSync() {
        return this.ctrl ? this.ctrl.dropdown('is selection') : null;
    }

    isAnimated() {
        return this.ctrl$.pipe(map(() => this.ctrl.dropdown('is animated')));
    }

    isAnimatedSync() {
        return this.ctrl ? this.ctrl.dropdown('is animated') : null;
    }

    isVisible() {
        return this.ctrl$.pipe(map(() => this.ctrl.dropdown('is visible')));
    }

    isVisibleSync() {
        return this.ctrl ? this.ctrl.dropdown('is visible') : null;
    }

    isHidden() {
        return this.ctrl$.pipe(map(() => this.ctrl.dropdown('is hidden')));
    }

    isHiddenSync() {
        return this.ctrl ? this.ctrl.dropdown('is hidden') : null;
    }

    getDefaultText() {
        return this.ctrl$.pipe(map(() => this.ctrl.dropdown('get default text')));
    }

    getDefaultTextSync() {
        return this.ctrl ? this.ctrl.dropdown('get default text') : null;
    }

    isMultiple() {
        return classesContains(this.eleRef.nativeElement, this.className.multiple);
    }

    writeValue(value: any) {
        if (this.modelSub) {
            this.modelSub.unsubscribe();
        }

        this.modelSub =
            forkJoin([ this.ctrl$, waitFor(() => this.itemsRendered()) ]).subscribe(() => {
                if (value !== this._value) {
                    this._value = value || '';
                    this.cdf.markForCheck();

                    if (this._value) {
                        if (this.isMultiple()) {
                            this.setExactly(String(this._value).split(this.delimiter));
                        } else {
                            this.setSelected(this._value);
                        }
                    } else {
                        this.clear();
                    }
                }
            });
    }

    registerOnChange(fn: Function) {
        this.controlChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.controlTouch = fn;
    }

    get shouldShowDropdownIcon() {
        return this.showDropdownIcon === undefined ?
            classesContains(this.eleRef.nativeElement, this.className.selection) : this.showDropdownIcon;
    }

    private itemsRendered() {
        if (!this.rootMenu) {
            return false;
        } else {
            return !!(this.rootMenu.nativeElement as Element).querySelector('.item');
        }
    }

    private setPlaceholder() {
        if (this.placeholder) {
            let defaultTextEle = (this.eleRef.nativeElement as Element).querySelector('.default.text');
            if (defaultTextEle) {
                defaultTextEle.innerHTML = this.placeholder;
            }
        }
    }

}