import { Object, UNDEFINED } from "./object";



export interface Context {
    store: Map<string, Object>;
    outer?: Context;
}

export class Context implements Context {
    
    public constructor(outer?: Context) {
        this.store = new Map();
        this.outer = outer;
    }

    private get(key: string): Object {
        let obj = this.store.get(key);

        if (!obj) {
            obj = this.outer?.get(key);
        }

        return obj || UNDEFINED;
    }

    private set(key: string, value: Object) {
        this.store.set(key, value);
    }

    public declareVar(varname: string, value?: Object) {
        if (!value) {
            value = UNDEFINED;
        }

        if (this.store.has(varname)) {
            throw `Cannot declare variable ${varname}. As it is already defined`;
        }

        this.store.set(varname, value);
        return value;
    }

    public assignVar(varname: string, value: Object) {
        const ctx = this.resolve(varname);
        ctx.set(varname, value);

        return value;
    }

    public lookupVar(varname: string) {
        const ctx = this.resolve(varname);
        return ctx.get(varname);
    }

    private resolve(varname: string): Context {
        if (this.store.has(varname)) {
            return this;
        }

        if (!this.outer) {
            throw `Cannot resolve ${varname}`;
        }

        return this.outer.resolve(varname);
    }
}