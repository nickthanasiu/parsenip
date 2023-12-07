import { Token, TokenType, newToken } from "./token";

export type Node = Expression | Statement | Program;

////////////////
// Expressions
////////////////

export type Expression = 
    | Identifier
    | IntegerLiteral
    | BooleanLiteral
    | PrefixExpression
;

export interface Identifier {
    token: Token;
    value: string;
};

export function identifier(value: string): Identifier {
    return {
        token: newToken(TokenType.IDENT, value),
        value
    }
}

export interface IntegerLiteral {
    token: Token;
    value: number;
}

export function integerLiteral(value: number): IntegerLiteral {
    return {
        token: newToken(TokenType.IDENT, value.toString()),
        value: value
    };
}

export interface BooleanLiteral {
    token: Token;
    value: boolean;
}


/*
export function booleanLiteral(value: boolean): BooleanLiteral {
    return {
        token: newToken(TokenType.ASSIGN)
        value
    }
}
*/

export interface PrefixExpression {
    token: Token;
    operator: string;
    right: Expression;
}

export function prefixExpression(token: Token, right: Expression): PrefixExpression {
    return {
        token,
        operator: token.literal,
        right
    }
}

////////////////
// Statements
////////////////

export type Statement = 
    | LetStatement
    | ReturnStatement
    | ExpressionStatement
;

export interface LetStatement {
    type: "LetStatement";
    token: Token;
    name: Identifier;
    value?: Expression;
};

export function letStatement(name: Identifier): LetStatement {
    return {
        type: "LetStatement",
        token: newToken(TokenType.LET, "let"),
        name
    };
}

export interface ReturnStatement {
    type: "ReturnStatement";
    token: Token;
    //returnValue: Expression;
}

export function returnStatement(): ReturnStatement {
    return {
        type: "ReturnStatement",
        token: newToken(TokenType.RETURN, "return"),
    };
}

export interface ExpressionStatement {
    type: "ExpressionStatement";
    token: Token;
    expression: Expression;
}

export function expressionStatement(token: Token, expression: Expression): ExpressionStatement {
    return {
        type: "ExpressionStatement",
        token,
        expression
    }
}

////////////////
// Program
////////////////

export interface Program {
    type: "Program";
    body: Statement[];
}

export function program(statements: Statement[] = []): Program {
    return {
        type: "Program",
        body: statements
    };
}
