import { Position } from "./token";

export type Node = Expression | Statement | Program;

////////////////
// Expressions
////////////////

export type Expression = 
    | Identifier
    | PrefixExpression
    | InfixExpression

    // Literals
    | IntegerLiteral
    | BooleanLiteral
    //| Object
;



export interface Identifier extends Position {
    type: "identifier",
    value: string;
};

export function identifier(value: string, position: Position): Identifier {
    return {
        type: "identifier",
        value,
        ...position,
    }
}

export interface IntegerLiteral extends Position {
    type: "integerLiteral";
    value: number;
}

export function integerLiteral(value: number, position: Position): IntegerLiteral {
    return {
        type: "integerLiteral",
        value,
        ...position
    };
}

export interface BooleanLiteral extends Position {
    type: 'booleanLiteral';
    value: boolean;
}


export function booleanLiteral(value: boolean, position: Position): BooleanLiteral {
    return {
        type: "booleanLiteral",
        value,
        ...position
    }
}

export interface Property {
    type: "property",
    key: string,
    value?: Expression
}

export interface ObjectLiteral extends Position {
    type: "objectLiteral",
    properties: Property[]
}

export function objectLiteral() {
    return;
}

export interface PrefixExpression extends Position {
    type: "prefixExpression";
    operator: string;
    right: Expression;
}

export function prefixExpression(operator: string, right: Expression, position: Position): PrefixExpression {
    return {
        type: "prefixExpression",
        operator,
        right,
        ...position
    }
}

interface InfixExpression extends Position {
    type: "infixExpression";
    left: Expression;
    operator: string;
    right: Expression;
}

export function infixExpression(left: Expression, operator: string, right: Expression, position: Position): InfixExpression {
    return {
        type: "infixExpression",
        left,
        operator,
        right,
        ...position
    };
}

////////////////
// Statements
////////////////

export type Statement =
    | VariableDeclarationStatement
    | ReturnStatement
    | ExpressionStatement
;

export interface VariableDeclarationStatement extends Position {
    type: "variableDeclaration";
    constant: boolean;
    identifier: Identifier;
    value?: Expression | null;
}

export function variableDeclaration(
    constant: boolean,
    identifier: Identifier,
    position: Position,
    value?: Expression | null,
): VariableDeclarationStatement {
    return {
        type: "variableDeclaration",
        ...position,
        constant,
        identifier,
        value,
    }
}

export interface ReturnStatement extends Position {
    type: "returnStatement";
    returnValue: Expression;
}

export function returnStatement(expression: Expression, position: Position): ReturnStatement {
    return {
        type: "returnStatement",
        ...position,
        returnValue: expression
    };
}

export interface ExpressionStatement extends Position {
    type: "expressionStatement";
    expression: Expression;
}

export function expressionStatement(expression: Expression, position: Position): ExpressionStatement {
    return {
        type: "expressionStatement",
        ...position,
        expression
    }
}

////////////////
// Program
////////////////

export interface Program extends Position {
    type: "program";
    body: Statement[];
}

export function program(statements: Statement[] = [], position: Position): Program {
    return {
        type: "program",
        ...position,
        body: statements,
    };
}
