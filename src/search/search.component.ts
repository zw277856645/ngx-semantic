import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2,
    SimpleChanges, TemplateRef, ViewChild
} from '@angular/core';
import { Base } from '../base';
import { InputBoolean, InputNumber } from '@demacia/cmjs-lib';
import { isNotFirstChanges, OutputReturnWrapper } from '../utils';
import { map } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import ApiSettings = SemanticUI.ApiSettings;

@Component({
    selector: 'sm-search',
    templateUrl: './search.component.html',
    styleUrls: [
        '../base.less',
        './search.component.less'
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SearchComponent,
            multi: true
        }
    ],
    exportAs: 'search',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent extends Base implements AfterViewInit, OnChanges, ControlValueAccessor {

    @ViewChild('defaultInput', { static: true }) @Input() inputTemplate: TemplateRef<void>;

    @Input() icon: string | TemplateRef<void>;
    @Input() placeholder: string;
    @Input() @InputNumber() maxLength: number;
    @Input() @InputBoolean() circular = true;

    @Input() type: 'standard' | 'category' = 'standard';
    @Input() apiSettings: ApiSettings | false = false;
    @Input() @InputNumber() minCharacters = 1;
    @Input() @InputBoolean() selectFirstResult = false;
    @Input() source: false | any = false;
    @Input() @InputBoolean() searchOnFocus = true;

    @Input() searchFields = [
        'title',
        'description'
    ];

    @Input() @InputBoolean() searchFullText = false;
    @Input() @InputNumber() hideDelay = 0;
    @Input() @InputNumber() searchDelay = 200;
    @Input() @InputNumber() maxResults = 7;
    @Input() @InputBoolean() cache = true;
    @Input() @InputBoolean() showNoResults = true;
    @Input() transition = 'scale';
    @Input() @InputNumber() duration = 200;
    @Input() easing = 'easeOutExpo';

    @Input() fields = {
        categories: 'results',
        categoryName: 'name',
        categoryResults: 'results',
        description: 'description',
        image: 'image',
        price: 'price',
        results: 'results',
        title: 'title',
        url: 'url',
        action: 'action',
        actionText: 'text',
        actionURL: 'url'
    };

    @Input('fields.categories') fieldsCategories: string;
    @Input('fields.categoryName') fieldsCategoryName: string;
    @Input('fields.categoryResults') fieldsCategoryResults: string;
    @Input('fields.description') fieldsDescription: string;
    @Input('fields.image') fieldsImage: string;
    @Input('fields.price') fieldsPrice: string;
    @Input('fields.results') fieldsResults: string;
    @Input('fields.title') fieldsTitle: string;
    @Input('fields.url') fieldsUrl: string;
    @Input('fields.action') fieldsAction: string;
    @Input('fields.actionText') fieldsActionText: string;
    @Input('fields.actionURL') fieldsActionURL: string;

    /* tslint:disable:no-output-on-prefix */

    @Output() onSelect = new EventEmitter<OutputReturnWrapper<{ result: any, response: any }>>();
    @Output() onResultsAdd = new EventEmitter<OutputReturnWrapper<{ html: string }>>();
    @Output() onSearchQuery = new EventEmitter<string>();
    @Output() onResults = new EventEmitter<any>();
    @Output() onResultsOpen = new EventEmitter();
    @Output() onResultsClose = new EventEmitter();

    @Input() className = {
        animating: 'animating',
        active: 'active',
        empty: 'empty',
        focus: 'focus',
        hidden: 'hidden',
        loading: 'loading',
        pressed: 'down'
    };

    @Input('className.animating') classNameAnimating: string;
    @Input('className.active') classNameActive: string;
    @Input('className.empty') classNameEmpty: string;
    @Input('className.focus') classNameFocus: string;
    @Input('className.hidden') classNameHidden: string;
    @Input('className.loading') classNameLoading: string;
    @Input('className.pressed') classNamePressed: string;

    @Input() error = {
        source: 'Cannot search. No source used, and Semantic API module was not included',
        noResults: 'Your search returned no results',
        noEndpoint: 'No search endpoint was specified',
        noTemplate: 'A valid template name was not specified.',
        serverError: 'There was an issue querying the server.',
        maxResults: 'Results must be an array to use maxResults setting',
        method: 'The method you called is not defined.'
    };

    @Input('error.source') errorSource: string;
    @Input('error.noResults') errorNoResults: string;
    @Input('error.noEndpoint') errorNoEndpoint: string;
    @Input('error.noTemplate') errorNoTemplate: string;
    @Input('error.serverError') errorServerError: string;
    @Input('error.maxResults') errorMaxResults: string;
    @Input('error.method') errorMethod: string;

    @Input() metadata = {
        cache: 'cache',
        results: 'results',
        result: 'result'
    };

    @Input('metadata.cache') metadataCache: string;
    @Input('metadata.results') metadataResults: string;
    @Input('metadata.result') metadataResult: string;

    @Input() regExp = {
        escape: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
        beginsWith: '(?:\s|^)'
    };

    @Input('regExp.escape') regExpEscape: RegExp | string;
    @Input('regExp.beginsWith') regExpBeginsWith: RegExp | string;

    @Input() selector = {
        prompt: '.prompt',
        searchButton: '.search.button'
    };

    @Input('selector.prompt') selectorPrompt: string;
    @Input('selector.searchButton') selectorSearchButton: string;

    @Input() templates = {
        escape: false,
        message: false,
        category: false,
        standard: false
    };

    @Input('templates.escape') templatesEscape: (str: string) => string;
    @Input('templates.message') templatesMessage: (message: string, type: string) => string;
    @Input('templates.category') templatesCategory: (response: any, fields: { [ k: string ]: string }) => string;
    @Input('templates.standard') templatesStandard: (response: any, fields: { [ k: string ]: string }) => string;

    private controlChange: Function = new Function();
    private controlTouch: Function = new Function();
    private modelSub: Subscription;
    private _value: any;

    constructor(private eleRef: ElementRef,
                renderer: Renderer2) {
        super(renderer);
        super.addClasses(this.eleRef.nativeElement, 'ui search');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.inputTemplate
            && !changes.icon
            && !changes.placeholder
            && !changes.maxLength
            && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        const finalOptions = $.extend(true, {}, this.options, {
            type: this.type,
            apiSettings: this.apiSettings,
            minCharacters: this.minCharacters,
            selectFirstResult: this.selectFirstResult,
            source: this.source,
            searchOnFocus: this.searchOnFocus,
            searchFields: this.searchFields,
            searchFullText: this.searchFullText,
            hideDelay: this.hideDelay,
            searchDelay: this.searchDelay,
            maxResults: this.maxResults,
            cache: this.cache,
            showNoResults: this.showNoResults,
            transition: this.transition,
            duration: this.duration,
            easing: this.easing,
            fields: this.fields,

            onSelect: (result: any, response: any) => {
                let returnValue = null;
                this.onSelect.emit((cb: Function | any) => {
                    return returnValue = typeof cb === 'function' ? cb(result, response) : !!cb;
                });

                this.controlChange(result[ this.fields.title ]);
                this.controlTouch(result[ this.fields.title ]);

                return returnValue !== false;
            },
            onResultsAdd: (html: string) => {
                let returnValue = null;
                this.onResultsAdd.emit((cb: Function | any) => {
                    return returnValue = typeof cb === 'function' ? cb(html) : !!cb;
                });

                return returnValue !== false;
            },
            onSearchQuery: (query: string) => {
                this.controlChange(query);
                this.controlTouch(query);
                this.onSearchQuery.emit(query);
            },
            onResults: (response: any) => this.onResults.emit(response),
            onResultsOpen: () => this.onResultsOpen.emit(),
            onResultsClose: () => this.onResultsClose.emit(),

            className: this.className,
            error: this.error,
            metadata: this.metadata,
            regExp: this.regExp,
            selector: this.selector,

            silent: this.silent,
            debug: this.debug,
            performance: this.performance,
            verbose: this.verbose
        });

        for (let name in this.templates) {
            if (typeof this.templates[ name ] === 'function') {
                if (!finalOptions.templates) {
                    finalOptions.templates = {};
                }

                finalOptions.templates[ name ] = this.templates[ name ];
            }
        }

        this.ctrl = $(this.eleRef.nativeElement).search(finalOptions);
    }

    registerOnChange(fn: Function) {
        this.controlChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.controlTouch = fn;
    }

    writeValue(value: any) {
        if (this.modelSub) {
            this.modelSub.unsubscribe();
        }

        this.modelSub = this.ctrl$.subscribe(() => {
            if (value !== this._value) {
                this._value = value;
                this.setValue(value);
            }
        });
    }

    query() {
        this.ctrl$.subscribe(() => this.ctrl.search('query'));
    }

    displayMessage(text: string, type: string) {
        this.ctrl$.subscribe(() => this.ctrl.search('display message', text, type));
    }

    cancelQuery() {
        this.ctrl$.subscribe(() => this.ctrl.search('cancel query'));
    }

    searchLocal(query: string) {
        this.ctrl$.subscribe(() => this.ctrl.search('search local', query));
    }

    hasMinimumCharacters() {
        return this.ctrl$.pipe(map(() => this.ctrl.search('has minimum characters')));
    }

    hasMinimumCharactersSync() {
        return this.ctrl ? this.ctrl.search('has minimum characters') : null;
    }

    searchRemote(query: string) {
        this.ctrl$.subscribe(() => this.ctrl.search('search remote', query));
    }

    searchObject(query: string, object: any, searchFields: string[]) {
        return this.ctrl$.pipe(map(() => this.ctrl.search('search object', query, object, searchFields)));
    }

    searchObjectSync(query: string, object: any, searchFields: string[]) {
        return this.ctrl ? this.ctrl.search('search object', query, object, searchFields) : null;
    }

    isFocused() {
        return this.ctrl$.pipe(map(() => this.ctrl.search('is focused')));
    }

    isFocusedSync() {
        return this.ctrl ? this.ctrl.search('is focused') : null;
    }

    isVisible() {
        return this.ctrl$.pipe(map(() => this.ctrl.search('is visible')));
    }

    isVisibleSync() {
        return this.ctrl ? this.ctrl.search('is visible') : null;
    }

    isEmpty() {
        return this.ctrl$.pipe(map(() => this.ctrl.search('is empty')));
    }

    isEmptySync() {
        return this.ctrl ? this.ctrl.search('is empty') : null;
    }

    getValue() {
        return this.ctrl$.pipe(map(() => this.ctrl.search('get value')));
    }

    getValueSync() {
        return this.ctrl ? this.ctrl.search('get value') : null;
    }

    getResult(value: any) {
        return this.ctrl$.pipe(map(() => this.ctrl.search('get result', value)));
    }

    getResultSync(value: any) {
        return this.ctrl ? this.ctrl.search('get result', value) : null;
    }

    setValue(value: any) {
        this.ctrl$.subscribe(() => this.ctrl.search('set value', value));
    }

    readCache(query: string) {
        this.ctrl$.subscribe(() => this.ctrl.search('read cache', query));
    }

    clearCache(query?: string) {
        this.ctrl$.subscribe(() => this.ctrl.search('clear cache', query));
    }

    writeCache(query: string) {
        this.ctrl$.subscribe(() => this.ctrl.search('write cache', query));
    }

    addResults(html: string) {
        this.ctrl$.subscribe(() => this.ctrl.search('add results', html));
    }

    showResults() {
        this.ctrl$.subscribe(() => this.ctrl.search('show results'));
    }

    hideResults() {
        this.ctrl$.subscribe(() => this.ctrl.search('hide results'));
    }

    generateResults(response: any) {
        this.ctrl$.subscribe(() => this.ctrl.search('generate results', response));
    }

    destroy() {
        this.ctrl$.subscribe(() => this.ctrl.search('destroy'));
    }
}