import * as ast from  './ast';
import { Environment } from './environment';

export type Object =
    | Integer
    | Boolean
    | String
    | ObjectLiteral
    | ArrayLiteral
    | Null
    | Undefined
    | FunctionExpr
    | FunctionDec
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

export interface ObjectLiteral {
    kind: "objectLiteral";
    properties: ast.Property[];
}

export function objectLiteral(properties: ast.Property[]): ObjectLiteral {
    return {
        kind: "objectLiteral",
        properties
    }
}

export interface ArrayLiteral {
    kind: "arrayLiteral";
    elements: ast.Expression[];
}

export function arrayLiteral(elements: ast.Expression[]): ArrayLiteral {
    return {
        kind: "arrayLiteral",
        elements
    }
}

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
    env: Environment
}

export function functionExpr(
    parameters: ast.Identifier[],
    body:       ast.BlockStatement,
    env:        Environment
): FunctionExpr {
    return {
        kind: "functionExpression", parameters, body, env
    };
}

export interface FunctionDec {
    kind:       "functionDeclaration";
    identifier: ast.Identifier;
    parameters: ast.Identifier[];
    body:       ast.BlockStatement;
    env:        Environment;
}

export function functionDec(
    identifier: ast.Identifier,
    parameters: ast.Identifier[],
    body:       ast.BlockStatement,
    env:        Environment
): FunctionDec {
    return {
        kind: "functionDeclaration",
        identifier,
        parameters,
        body,
        env
    }
}

export function toString(obj: Object): string {
    switch (obj.kind) {
        case "boolean":
            return `${obj.value} : boolean`;
        case "integer":
            return `${obj.value} : integer`;
        case "string":
            return `${obj.value} : string`;
        case "objectLiteral":
            return JSON.stringify(obj);
        case "arrayLiteral":
            return JSON.stringify(obj.elements);
        case "null":
            return "null";
        case "undefined":
            return "undefined";
        case "functionExpression":
        case "functionDeclaration":
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