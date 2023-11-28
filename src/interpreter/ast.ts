import { Token, TokenType, newToken } from "./token";

//type Node = Statement | Expression | Program;
type Expression = Identifier;
type Statement = LetStatement;

export interface LetStatement {
    token: Token;
    name: Identifier;
    value: Expression;
};

export class LetStatement implements LetStatement {
    constructor(name: Identifier) {
        this.token = newToken(TokenType.LET, "let");
        this.name = name;
    }
}


export interface Identifier {
    token: Token;
    value: string;
};

export function identifier(token: Token, value: string): Identifier {
    return {
        token,
        value
    }
}

export interface Program {
    statements: Statement[];
}

export class Program implements Program {
    constructor(statements: Statement[] = []) {
        this.statements = statements;
    }
}