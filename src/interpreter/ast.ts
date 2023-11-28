import { Token, TokenType, newToken } from "./token";

//type Node = Statement | Expression | Program;
type Expression = Identifier;
type Statement = 
    | LetStatement
    | ReturnStatement;

export interface LetStatement {
    token: Token;
    name: Identifier;
    value?: Expression;
};


export function letStatement(name: Identifier): LetStatement {
    return {
        token: newToken(TokenType.LET, "let"),
        name
    };
}

export interface ReturnStatement {
    token: Token;
    //returnValue: Expression;
}

export function returnStatement() {
    return {
        token: newToken(TokenType.RETURN, "return"),
    };
}

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

export interface Program {
    statements: Statement[];
}

export function program(statements: Statement[] = []) {
    return {
        statements
    };
}
