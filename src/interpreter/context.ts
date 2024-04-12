import { Object } from "./object";

export interface Context {
    store: Map<string, Object>;
    outer?: Context;
}

export class Context implements Context {
    
    public constructor(outer?: Context) {
        this.store = new Map();
        this.outer = outer;
    }

    public get(key: string): Object | undefined {
        let obj = this.store.get(key);

        if (!obj) {
            obj = this.outer?.get(key);
        }

        return obj;
    }

    public set(key: string, value: Object) {
        this.store.set(key, value);
    }
}