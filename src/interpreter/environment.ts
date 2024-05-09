import { Object, UNDEFINED } from "./object";

export interface Environment {
    store: Map<string, Object>;
    outer?: Environment;
}

export class Environment implements Environment {
    
    public constructor(outer?: Environment) {
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

    public declareVar(varName: string, value?: Object) {
        if (!value) {
            value = UNDEFINED;
        }

        if (this.store.has(varName)) {
            throw `Cannot declare variable ${varName}. As it is already defined`;
        }

        this.store.set(varName, value);
        return value;
    }

    public assignVar(varName: string, value: Object) {
        const env = this.resolve(varName);
        env.set(varName, value);

        return value;
    }

    public lookupVar(varName: string) {
        const env = this.resolve(varName);
        return env.get(varName);
    }

    private resolve(varName: string): Environment {
        if (this.store.has(varName)) {
            return this;
        }

        if (!this.outer) {
            throw `Cannot resolve ${varName}`;
        }

        return this.outer.resolve(varName);
    }
}