import {
    AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, ElementRef, EventEmitter, Input, OnChanges,
    Output, QueryList, Renderer2, SimpleChanges, ViewChild
} from '@angular/core';
import { Base } from '../base';
import { InputBoolean, InputNumber } from '@demacia/cmjs-lib';
import { TabComponent } from './tab.component';
import { ElementSelector, isNotFirstChange, isNotFirstChanges } from '../utils';
import { debounceTime, filter, map, startWith } from 'rxjs/operators';

@Component({
    selector: 'sm-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: [ '../base.less' ],
    exportAs: 'tabs',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent extends Base implements AfterViewInit, OnChanges {

    @ViewChild('menu', { static: false }) menu: ElementRef;
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    @Input() class: string;

    @Input() activeTab: string;
    @Output() activeTabChange = new EventEmitter<string>();

    @Input() @InputBoolean() auto = false;
    @Input() deactivate: 'siblings' | 'all' = 'siblings';
    @Input() @InputBoolean() history = false;
    @Input() historyType: 'hash' | 'state' = 'hash';
    @Input() @InputBoolean() ignoreFirstLoad = false;
    @Input() evaluateScripts: 'once' | boolean = 'once';
    @Input() @InputBoolean() alwaysRefresh = false;
    @Input() @InputBoolean() cache = true;
    @Input() apiSettings: any | false = false;
    @Input() path: string | false = false;
    @Input() context: ElementSelector | 'parent' | false = 'parent';
    @Input() @InputBoolean() childrenOnly = false;
    @Input() @InputNumber() maxDepth = 25;

    /* tslint:disable:no-output-on-prefix */

    @Output() onFirstLoad = new EventEmitter<{ tabPath: string, parameterArray: any[], historyEvent: any }>();
    @Output() onLoad = new EventEmitter<{ tabPath: string, parameterArray: any[], historyEvent: any }>();
    @Output() onVisible = new EventEmitter<{ tabPath: string }>();
    @Output() onRequest = new EventEmitter<{ tabPath: string }>();

    @Input() templates = {
        determineTitle: (tabArray: any[]) => {
        }
    };

    @Input('templates.determineTitle') templatesDetermineTitle: (tabArray: any[]) => any;

    @Input() metadata = {
        tab: 'tab',
        loaded: 'loaded',
        promise: 'promise'
    };

    @Input('metadata.tab') metadataTab: string;
    @Input('metadata.loaded') metadataLoaded: string;
    @Input('metadata.promise') metadataPromise: string;

    @Input() className = {
        loading: 'loading',
        active: 'active'
    };

    @Input('className.loading') classNameLoading: string;
    @Input('className.active') classNameActive: string;

    @Input() error = {
        api: 'You attempted to load content without API module',
        method: 'The method you called is not defined',
        missingTab: 'Activated tab cannot be found. Tabs are case-sensitive.',
        noContent: 'The tab you specified is missing a content url.',
        path: 'History enabled, but no path was specified',
        recursion: 'Max recursive depth reached',
        state: 'The state library has not been initialized'
    };

    @Input('error.api') errorApi: string;
    @Input('error.method') errorMethod: string;
    @Input('error.missingTab') errorMissingTab: string;
    @Input('error.noContent') errorNoContent: string;
    @Input('error.path') errorPath: string;
    @Input('error.recursion') errorRecursion: string;
    @Input('error.state') errorState: string;

    constructor(renderer: Renderer2) {
        super(renderer);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.activeTab && !changes.class && isNotFirstChanges(changes)) {
            this.ngAfterViewInit();
        }
        if (isNotFirstChange(changes.activeTab)) {
            this.changeTab(this.activeTab);
        }
    }

    ngAfterViewInit() {
        super.mergeProps();

        this.tabs
            .changes
            .pipe(
                startWith(true),
                debounceTime(0),
                filter(() => this.tabs.length > 0)
            )
            .subscribe(() => this.init());
    }

    trackByTabs(i: number, tab: TabComponent) {
        return tab.tabName;
    }

    get activeTabIndex() {
        if (this.tabs.length) {
            return this.tabs.toArray().findIndex(tab => tab.tabName === this.activeTab);
        } else {
            return -1;
        }
    }

    attachEvents(selector: string, event?: string) {
        this.ctrl$.subscribe(() => this.ctrl.tab('attach events', selector, event));
    }

    changeTab(path: string) {
        this.ctrl$.subscribe(() => this.ctrl.tab('change tab', path));
    }

    setState(path: string) {
        this.ctrl$.subscribe(() => this.ctrl.tab('set state', path));
    }

    getPath() {
        return this.ctrl$.pipe(map(() => this.ctrl.tab('get path')));
    }

    getPathSync() {
        return this.ctrl ? this.ctrl.tab('get path') : null;
    }

    isTab() {
        return this.ctrl$.pipe(map(() => this.ctrl.tab('is tab')));
    }

    isTabSync() {
        return this.ctrl ? this.ctrl.tab('is tab') : null;
    }

    cacheRead(path: string) {
        return this.ctrl$.pipe(map(() => this.ctrl.tab('cache read', path)));
    }

    cacheReadSync(path: string) {
        return this.ctrl ? this.ctrl.tab('cache read', path) : null;
    }

    cacheAdd(path: string, html: string) {
        return this.ctrl$.subscribe(() => this.ctrl.tab('cache add', path, html));
    }

    cacheRemove(path: string) {
        return this.ctrl$.subscribe(() => this.ctrl.tab('cache remove', path));
    }

    private init() {
        this.ctrl = $((this.menu.nativeElement as HTMLElement).children).tab(
            $.extend(true, {}, this.options, {
                auto: this.auto,
                deactivate: this.deactivate,
                history: this.history,
                historyType: this.historyType,
                ignoreFirstLoad: this.ignoreFirstLoad,
                evaluateScripts: this.evaluateScripts,
                alwaysRefresh: this.alwaysRefresh,
                cache: this.cache,
                apiSettings: this.apiSettings,
                path: this.path,
                context: this.context,
                childrenOnly: this.childrenOnly,
                maxDepth: this.maxDepth,

                onFirstLoad: (tabPath: string, parameterArray: any[], historyEvent: any) => {
                    this.onFirstLoad.emit({ tabPath, parameterArray, historyEvent });
                },
                onLoad: (tabPath: string, parameterArray: any[], historyEvent: any) => {
                    this.onLoad.emit({ tabPath, parameterArray, historyEvent });
                },
                onVisible: (tabPath: string) => {
                    this.activeTab = tabPath;
                    this.activeTabChange.emit(tabPath);
                    this.onVisible.emit({ tabPath });
                    this.tabs.forEach(tab => tab.active = tab.tabName === this.activeTab);
                },
                onRequest: (tabPath: string) => this.onRequest.emit({ tabPath }),

                templates: this.templates,
                metadata: this.metadata,
                className: this.className,
                error: this.error,

                silent: this.silent,
                debug: this.debug,
                performance: this.performance,
                verbose: this.verbose
            }) as object
        );

        // 有初始值，优先级高于类
        if (this.activeTab !== null && this.activeTab !== undefined) {
            this.changeTab(this.activeTab);
        }
        // 没设初始值，从类中寻找是否有 active 项
        else {
            let active = this.tabs.find(tab => tab.class && tab.class.includes(this.className.active));
            if (active) {
                this.changeTab(active.tabName);
            } else {
                // 默认设置第一项为激活状态
                this.changeTab(this.tabs.first.tabName);
            }
        }
    }
}