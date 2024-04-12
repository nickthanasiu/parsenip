export type Object =
    | Integer
    | Boolean
    | String
    | Null
    | ReturnValue

export interface Integer {
    kind: "integer";
    value: number;
}

export function integer(value: number): Integer {
    return {
        kind: "integer",
        value
    };
}

export interface String {
    kind: "string";
    value: string;
}

export function string(value: string): String {
    return {
        kind: "string",
        value
    }
}

export interface Boolean {
    kind: "boolean";
    value: boolean;
}

export function boolean(value: boolean): Boolean {
    return {
        kind: "boolean",
        value
    }
}

export const TRUE = boolean(true);
export const FALSE = boolean(false);


interface Null {
    kind: "null"
};

export const NULL: Null = { kind: "null" };


export interface ReturnValue {
    kind: "returnValue";
    value: Object;
}

export function returnValue(value: Object): ReturnValue {
    return {
        kind: "returnValue",
        value
    }
}


export function toString(obj: Object) {
    switch (obj.kind) {
        case "boolean":
            return `${obj.value} : boolean`;
        case "integer":
            return `${obj.value} : integer`;
        case "string":
            return `${obj.value} : string`;
        case "null":
            return "null";
        default:
            throw new Error(`
            obj.toString was passed
            unhandled object type: ${obj.kind}
        `);
    }
}