import * as ast from  './ast';
import { Context } from './context';

export type Object =
    | Integer
    | Boolean
    | String
    | Null
    | Undefined
    | FunctionExpr
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

interface Undefined {
    kind: "undefined"
}

export const UNDEFINED: Undefined = { kind: "undefined" }

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

export interface FunctionExpr {
    kind: "functionExpression";
    parameters: ast.Identifier[];
    body: ast.BlockStatement;
    env: Context
}

export function functionExpr(
    parameters: ast.Identifier[],
    body:       ast.BlockStatement,
    env:        Context
): FunctionExpr {
    return {
        kind: "functionExpression", parameters, body, env
    };
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
        case "undefined":
            return "undefined";
        case "functionExpression":
            // @TODO: Find better format for this
            return `[Function]`;
        default:
            throw new Error(`
            obj.toString was passed
            unhandled object type: ${obj.kind}
        `);
    }
}
export function nativeBoolToBooleanObject(input: boolean): Boolean {
    return input ? TRUE : FALSE;
}