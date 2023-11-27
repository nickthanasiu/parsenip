import { Token, TokenType } from "./token";

interface Node {
    tokenLiteral(): string;
}

interface Statement extends Node {
    statementNode(): void;
}

interface Expression extends Node {
    expressionNode(): void;
}

/*
interface IProgram extends Node {
    statements: Statement[];
}
*/

class Program {
    statements: Statement[];

    constructor() {
        this.statements = [];
    }

    tokenLiteral() {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        } else {
            return ''
        }
    }
}

interface LetStatement {
    token: TokenType.LET;
    identifier: Identifier;
    value: Expression;
};

interface Identifier {
    token: TokenType.IDENT;
    value: string;
};