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
        const program = new ast.Program();

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
            default:
                return null;    
        }
    }

    private parseLetStatement() {
        
        if (!this.expectPeek(TokenType.IDENT)) return null;
        
        const name = ast.identifier(this.currToken, this.currToken.literal);
        
        if (!this.expectPeek(TokenType.ASSIGN)) return null;
        
        // @TODO: We're going to skip parsing expressions for now
        while (!this.currTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }
        
        return new ast.LetStatement(name);
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