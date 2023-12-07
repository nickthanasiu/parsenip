import { Lexer } from "./lexer";
import * as ast from "./ast";
import { Token, TokenType } from "./token";

enum Precedence {
    LOWEST = 0,
    EQUALS = 1,
    LESS_GREATER = 2,
    SUM = 3,
    PRODUCT = 4,
    PREFIX = 5,
    CALL = 6,
}

type prefixParseFn = () => ast.Expression | null;
//type infixParseFn = (leftSideExpression: ast.Expression) => ast.Expression | null;

export interface Parser {
   lexer: Lexer;
   currToken: Token;
   peekToken: Token;
   errors: string[];
}

export class Parser implements Parser {

    private prefixParseFns = this.bindPrefixParseFns([
        [TokenType.IDENT, this.parseIdentifier],
        [TokenType.INT, this.parseIntegerLiteral],
        [TokenType.BANG, this.parsePrefixExpression],
        [TokenType.MINUS, this.parsePrefixExpression],
    ]);

    //private infixParseFns = this.bindInfixParseFns([]);

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
                return this.parseExpressionStatement();    
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

    private parseExpressionStatement() {
        const expression = this.parseExpression(Precedence.LOWEST);
        const statement = ast.expressionStatement(this.currToken, expression as ast.Expression);

        console.log('parseExpressionStatement statement :: ', statement);

        if (this.peekTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }

        return statement;
    }

    private parseExpression(precedence: number) {
        const prefix = this.prefixParseFns.get(this.currToken.type);

        console.log(precedence);

        if (!prefix) {
            const errorMsg = `No prefix parse function found for ${this.currToken.type}`;
            this.errors.push(errorMsg);
            return null;
        }

        const leftExp = prefix();

        return leftExp;
    }

    private parsePrefixExpression() {
        const prefixOperatorToken = this.currToken;
        this.nextToken();
        const rightSideExpression = this.parseExpression(Precedence.PREFIX)

        if (!rightSideExpression) {
            return null;
        }

        return ast.prefixExpression(prefixOperatorToken, rightSideExpression);
    }

    private parseIdentifier() {
        return ast.identifier(this.currToken.literal);
    }

    private parseIntegerLiteral() {
        const literalValue = this.currToken.literal;
        const parsedValue = Number(this.currToken.literal);

        if (isNaN(parsedValue)) {  // @TODO is this the best way to parse/validate numbers?
            const errorMsg = `Could not parse ${literalValue} as integer`;
            this.errors.push(errorMsg);
            return null;
        }

        return ast.integerLiteral(parsedValue);
                
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
        const errorMsg = `Expected next token to be ${tokenType}, but got ${this.peekToken.type} instead`;
        this.errors.push(errorMsg);
    }

    private bindPrefixParseFns(prefixParseFns: [TokenType, prefixParseFn][]): Map<TokenType, prefixParseFn> {
        return new Map(this.bindMap(prefixParseFns));
    }

    /*
    private bindInfixParseFns(infixParseFns: [TokenType, infixParseFn][]): Map<TokenType, infixParseFn> {
        return new Map(this.bindMap(infixParseFns));
    }
    */

    private bindMap(blah: [TokenType, Function][]) {
        return blah.map(([_, fn]) => [_, fn.bind(this)] as const);
    }
}


export function parse(input: string) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    checkParserErrors(parser);

    return program;
}

export function checkParserErrors({ errors }: Parser) {
    if (errors.length) {
        let message = `Parser has ${errors.length} errors\n\n`;
        for (const error of errors) {
            message += `ERROR: ${error}'\n')`;
        }

        throw new Error(message);
    }

}