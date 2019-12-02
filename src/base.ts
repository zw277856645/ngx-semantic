import { Input, Renderer2 } from '@angular/core';
import { InputBoolean, waitFor } from '@demacia/cmjs-lib';
import { isObject, isPlainObject, uppercaseFirstChar } from './utils';

export abstract class Base {

    // 防止插件版本与 semantic 版本不匹配，没有支持某些配置，使用此配置对象做兜底
    @Input() options: any = {};

    @Input() @InputBoolean() silent = false;
    @Input() @InputBoolean() debug = false;
    @Input() @InputBoolean() performance = true;
    @Input() @InputBoolean() verbose = false;

    protected ctrl: JQuery;
    protected ctrl$ = waitFor(() => !!this.ctrl);

    protected constructor(protected renderer: Renderer2) {
    }

    static addClasses(renderer: Renderer2, ele: Element | EventTarget, classes: string) {
        (classes || '').split(/\s/).forEach(cls => renderer.addClass(ele, cls));
    }

    static removeClasses(renderer: Renderer2, ele: Element | EventTarget, classes: string) {
        (classes || '').split(/\s/).forEach(cls => renderer.removeClass(ele, cls));
    }

    protected addClasses(ele: Element | EventTarget, classes: string) {
        Base.addClasses(this.renderer, ele, classes);
    }

    protected removeClasses(ele: Element | EventTarget, classes: string) {
        Base.removeClasses(this.renderer, ele, classes);
    }

    protected mergeProps() {
        for (let prop in this) {
            if (this.hasOwnProperty(prop) && isPlainObject(this[ prop ])) {
                this.mergePropsInternal(prop);
            }
        }
    }

    private mergePropsInternal(mergeProp: string, context: any = this) {
        let props = mergeProp.split('.');
        let lastProp = props[ props.length - 1 ];

        for (let prop in context[ lastProp ]) {
            if (context[ lastProp ].hasOwnProperty(prop)) {
                let concatProp = props.map((p, i) => i > 0 ? uppercaseFirstChar(p) : p).join('')
                    + uppercaseFirstChar(prop);

                if ((concatProp in this) && this[ concatProp ] !== undefined) {
                    context[ lastProp ][ prop ] = this[ concatProp ];
                }
                if (isObject(context[ lastProp ][ prop ])) {
                    this.mergePropsInternal(mergeProp + '.' + prop, context[ lastProp ]);
                }
            }
        }
    }

}