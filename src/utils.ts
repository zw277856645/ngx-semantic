import {SimpleChange, SimpleChanges} from '@angular/core';

const hasOwn = Object.prototype.hasOwnProperty;

export function isObject(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isPlainObject(obj: any) {
    let proto, ctor;

    if (!obj || !isObject(obj)) {
        return false;
    }

    proto = Object.getPrototypeOf(obj);

    if (!proto) {
        return true;
    }

    ctor = hasOwn.call(proto, 'constructor') && proto.constructor;

    return typeof ctor === 'function' && hasOwn.toString.call(ctor) === hasOwn.toString.call(Object);
}

export function classesContains(ele: Element, cls: string) {
    let arr = cls.split(/\s/);
    for (let i = 0, len = arr.length; i < len; i++) {
        if (!ele.classList.contains(selector2Class(arr[i]))) {
            return false;
        }
    }

    return true;
}

export function isNotFirstChange(propChange: SimpleChange) {
    return propChange && !propChange.firstChange;
}

export function isNotFirstChanges(changes: SimpleChanges) {
    for (let change in changes) {
        if (!isNotFirstChange(changes[change])) {
            return false;
        }
    }

    return true;
}

export function string2Number(value: any) {
    return /^\d+/.test(value) ? parseFloat(value) : value;
}

export function selector2Class(value: string) {
    return value.replace(/^\./, '');
}

export function uppercaseFirstChar(str: string) {
    return str[0].toUpperCase() + str.substr(1);
}

export type OutputReturnWrapper<T> = (fn: ((arg: T) => any) | any) => any;

export type ElementSelector = string | JQuery | Element | EventTarget;