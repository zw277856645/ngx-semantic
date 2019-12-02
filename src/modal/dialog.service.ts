import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, TemplateRef } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { OutputReturnWrapper } from '../utils';

export class DialogOptions {

    title?: string;

    content: string;

    approveText?: string;

    cancelText?: string;

    showCancel?: boolean;

    variation?: string;

    event?: Event;

    template?: TemplateRef<any>;

    onApprove?: () => any;

    onDeny?: () => any;
}

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private appRef: ApplicationRef,
                private injector: Injector) {
    }

    open(config: DialogOptions) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
        const componentRef = componentFactory.create(this.injector);

        Object.assign(componentRef.instance, {
            title: config.title || '提示',
            content: config.content,
            approveText: config.approveText || '确定',
            cancelText: config.cancelText || '取消',
            showCancel: config.showCancel === undefined ? true : config.showCancel,
            variation: config.variation || 'small',
            event: config.event
        });

        if (config.template) {
            componentRef.instance.template = config.template;
        }

        const onApproveSub = componentRef.instance.onApprove.subscribe((wrapper: OutputReturnWrapper<any>) => {
            wrapper(() => {
                if (typeof config.onApprove === 'function') {
                    return config.onApprove();
                }
            });
        });

        const onDenySub = componentRef.instance.onDeny.subscribe(() => {
            if (typeof config.onDeny === 'function') {
                config.onDeny();
            }
        });

        const onHiddenSub = componentRef.instance.onHidden.subscribe(() => {
            componentRef.destroy();

            onApproveSub.unsubscribe();
            onDenySub.unsubscribe();
            onHiddenSub.unsubscribe();
        });

        this.appRef.attachView(componentRef.hostView);

        return {
            close: () => componentRef.instance.hide()
        };
    }
}