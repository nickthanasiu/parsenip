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

const precedences = new Map<TokenType, Precedence>([
    [TokenType.EQ, Precedence.EQUALS],
    [TokenType.NOT_EQ, Precedence.EQUALS],
    [TokenType.LT, Precedence.LESS_GREATER],
    [TokenType.GT, Precedence.LESS_GREATER],
    [TokenType.PLUS, Precedence.SUM],
    [TokenType.MINUS, Precedence.SUM],
    [TokenType.ASTERISK, Precedence.PRODUCT],
    [TokenType.SLASH, Precedence.PRODUCT],
]);

type prefixParseFn = () => ast.Expression | null;
type infixParseFn = (leftSideExpression: ast.Expression) => ast.Expression | null;

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
        [TokenType.TRUE, this.parseBooleanLiteral],
        [TokenType.FALSE, this.parseBooleanLiteral],
    ]);

    private infixParseFns = this.bindInfixParseFns([
        [TokenType.PLUS, this.parseInfixExpression],
        [TokenType.MINUS, this.parseInfixExpression],
        [TokenType.ASTERISK, this.parseInfixExpression],
        [TokenType.SLASH, this.parseInfixExpression],
        [TokenType.GT, this.parseInfixExpression],
        [TokenType.LT, this.parseInfixExpression],
        [TokenType.EQ, this.parseInfixExpression],
        [TokenType.NOT_EQ, this.parseInfixExpression],
    ]);

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

            
            // If statement is not null, add it to program.body
            if (statement) {
                program.body.push(statement);
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
        
        if (!this.expectPeek(TokenType.IDENT)) return null; // expectPeek checks peek token and advances parser
        
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

        if (!expression) return null;
        
        if (this.peekTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }
        
        return ast.expressionStatement(expression);
    }

    private parseExpression(precedence: number) {
        const prefixParseFn = this.prefixParseFns.get(this.currToken.type);

        if (!prefixParseFn) {
            const errorMsg = `No prefix parse function found for ${this.currToken.type}`;
            this.errors.push(errorMsg);
            return null;
        }

        let leftExp = prefixParseFn() as ast.Expression;

        while (
            !this.peekTokenIs(TokenType.SEMICOLON) &&
            precedence < this.peekPrecedence()
        ) {
            const infixParseFn = this.infixParseFns.get(this.peekToken.type);
            if (!infixParseFn) return leftExp;

            this.nextToken();
            leftExp = infixParseFn(leftExp) as ast.Expression;
        }

        return leftExp;
    }

    private parsePrefixExpression() {
        const prefixOperator = this.currToken.literal;
        this.nextToken();
        const right = this.parseExpression(Precedence.PREFIX)

        if (!right) {
            return null;
        }
        

        return ast.prefixExpression(prefixOperator, right);
    }

    private parseInfixExpression(left: ast.Expression) {
        const infixOperator = this.currToken.literal;
        const precedence = this.currPrecedence();
        this.nextToken();
        const right = this.parseExpression(precedence);

        if (!right) return null;

        return ast.infixExpression(left, infixOperator, right);
    }

    private parseIdentifier() {
        return ast.identifier(this.currToken.literal);
    }

    private parseIntegerLiteral() {
        const { literal } = this.currToken;
        const int = Number(literal);

        if (isNaN(int)) {  // @TODO is this the best way to parse/validate numbers?
            const errorMsg = `Could not parse ${literal} as integer`;
            this.errors.push(errorMsg);
            return null;
        }

        return ast.integerLiteral(int); 
    }

    private parseBooleanLiteral() {
        return ast.booleanLiteral(this.currToken.type === TokenType.TRUE);
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

    private peekError(t: TokenType) {
        const errorMsg = `Expected next token to be ${t}, but got ${this.peekToken.type} instead`;
        this.errors.push(errorMsg);
    }

    private peekPrecedence() {
        return precedences.get(this.peekToken.type) || Precedence.LOWEST;
    }

    private currPrecedence() {
        return precedences.get(this.currToken.type) || Precedence.LOWEST;
    }

    private bindPrefixParseFns(prefixParseFns: [TokenType, prefixParseFn][]): Map<TokenType, prefixParseFn> {
        return new Map(this.bindMap(prefixParseFns));
    }

    
    private bindInfixParseFns(infixParseFns: [TokenType, infixParseFn][]): Map<TokenType, infixParseFn> {
        return new Map(this.bindMap(infixParseFns));
    }


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
            message += `ERROR: ${error}\n`;
        }

        throw new Error(message);
    }

}