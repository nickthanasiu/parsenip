import { Lexer } from "./lexer";
import * as ast from "./ast";
import { Token, TokenType } from "./token";

export interface Parser {
   lexer: Lexer;
   currToken: Token;
   peekToken: Token;
   errors: string[];
}

export class Parser implements Parser {

    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.currToken = lexer.nextToken();
        this.peekToken  = lexer.nextToken();
        this.errors = [];
    }

    private nextToken() {
        this.currToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    }

    public parseProgram() {
        const program = ast.program();

        while (!this.currTokenIs(TokenType.EOF)) {
            const statement = this.parseStatement();
            
            // If statement is not null, add it to program.statements
            if (statement) {
                program.statements.push(statement);
            }

            this.nextToken();
        }


        return program;
    }

    private parseStatement() {
        switch (this.currToken.type) {
            case TokenType.LET:
                return this.parseLetStatement();
            case TokenType.RETURN:
                return this.parseReturnStatement();
            default:
                return null;    
        }
    }

    private parseLetStatement() {
        
        if (!this.expectPeek(TokenType.IDENT)) return null;
        
        const name = ast.identifier(this.currToken.literal);
        
        if (!this.expectPeek(TokenType.ASSIGN)) return null;
        
        // @TODO: We're going to skip parsing expressions for now
        while (!this.currTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }
        
        return ast.letStatement(name);
    }

    private parseReturnStatement() {
        const statement = ast.returnStatement();

        this.nextToken();

        // @TODO: We're going to skip parsing expressions for now
        while (!this.currTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }

        return statement;
    }

    private expectPeek(t: TokenType) {
        if (this.peekTokenIs(t)) {
            this.nextToken();
            return true;
        } else {
            this.peekError(t);
            return false;
        }
    }

    private currTokenIs(t: TokenType) {
        return this.currToken.type === t;
    }

    private peekTokenIs(t: TokenType) {
        return this.peekToken.type === t;
    }

    private peekError(tokenType: TokenType) {
        const message = `Expected next token to be ${tokenType}, but got ${this.peekToken.type} instead`;
        this.errors.push(message);
    }

}