import { Lexer } from "./lexer";
import * as ast from "./ast";
import { Token, TokenType, tokenTypeToString } from "./token";

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
            case TokenType.CONST:
                return this.parseVariableDeclaration();
            case TokenType.RETURN:
                return this.parseReturnStatement();
            default:
                return this.parseExpressionStatement();    
        }
    }

    // let IDENT;
    // (let | const) IDENT = EXPRESSION;
    private parseVariableDeclaration() {
        const start = this.currToken.position.start;
        const isConstant = this.currTokenIs(TokenType.CONST);

        if (!this.expectPeek(TokenType.IDENT)) {
            const errorMsg = `Expected identifier name following ${isConstant ? 'const' : 'let'} keyword`;
            this.errors.push(errorMsg);
            return null;
        }


        const identifier = ast.identifier(
            this.currToken.literal,
            this.currToken.position
        );

        if (this.expectPeek(TokenType.SEMICOLON)) {
            if (isConstant) {
                this.errors.push(`Must assign value to constant expression. No value provided`);
                return null;
            }

            return ast.variableDeclaration(
                isConstant,
                identifier,
                {
                    start,
                    end: this.currToken.position.end
                }
            );
        }

        if (!this.expectPeek(TokenType.ASSIGN)) {
            this.errors.push(`Expected assignment token following identifier in var declaration`);
            return null;
        }

        this.nextToken();

        const value = this.parseExpression(Precedence.LOWEST);

        const declaration = ast.variableDeclaration(
            isConstant,
            identifier,
            { start, end: this.currToken.position.end },
            value,
        );

        if (!this.expectPeek(TokenType.SEMICOLON)) {
            this.errors.push(`Variable declaration statement must end with semicolon`);
            return null;
        }

        return declaration;
    }

    private parseReturnStatement() {
        const start = this.currToken.position.start;
        this.nextToken();

        const expression = this.parseExpression(Precedence.LOWEST);

        if (!expression) {
            this.errors.push(`Expected expression following 'return'`);
            return null;
        }

        if (!this.expectPeek(TokenType.SEMICOLON)) {
            this.errors.push(`Return statement must end with semicolon`);
            return null;
        }
        
        return ast.returnStatement(expression, {
            start,
            end: this.currToken.position.end
        });
    }

    private parseExpressionStatement() {
        const start = this.currToken.position.start;
        const expression = this.parseExpression(Precedence.LOWEST);

        if (!expression) return null;
        
        if (this.peekTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }
        
        return ast.expressionStatement(expression, {
            start,
            end: this.currToken.position.end
        });
    }

    private parseExpression(precedence: number) {
        const prefixParseFn = this.prefixParseFns.get(this.currToken.type);

        if (!prefixParseFn) {
            const errorMsg = `No prefix parse function found for ${tokenTypeToString(this.currToken.type)}`;
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

    private parseObjectExpression() {
        if (!this.expectPeek(TokenType.LBRACE)) {
            this.errors.push(`Expected {, but found ${this.peekToken}`);
            return null;
        }

        const properties: ast.Property[] = [];


        while (!this.currTokenIs(TokenType.EOF) && !this.currTokenIs(TokenType.RBRACE)) {
            
        }
    }

    private parsePrefixExpression() {
        const start = this.currToken.position.start;
        const prefixOperator = this.currToken.literal;
        this.nextToken();
        const right = this.parseExpression(Precedence.PREFIX)

        if (!right) {
            return null;
        }
        

        return ast.prefixExpression(
            prefixOperator,
            right,
            {
                start,
                end: this.currToken.position.end
            }
        );
    }

    private parseInfixExpression(left: ast.Expression) {
        const start = this.currToken.position.start;
        const infixOperator = this.currToken.literal;
        const precedence = this.currPrecedence();
        this.nextToken();
        const right = this.parseExpression(precedence);

        if (!right) return null;

        return ast.infixExpression(
            left,
            infixOperator,
            right,
            {
                start,
                end: this.currToken.position.end
            }
        );
    }

    private parseIdentifier() {
        return ast.identifier(
            this.currToken.literal,
            this.currToken.position
        );
    }

    private parseIntegerLiteral() {
        const { literal, position: { start } } = this.currToken;
        const int = Number(literal);

        if (isNaN(int)) {  // @TODO is this the best way to parse/validate numbers?
            const errorMsg = `Could not parse ${literal} as integer`;
            this.errors.push(errorMsg);
            return null;
        }

        return ast.integerLiteral(int, { start, end: this.currToken.position.end}); 
    }

    private parseBooleanLiteral() {
        return ast.booleanLiteral(
            this.currTokenIs(TokenType.TRUE),
            this.currToken.position
        );
    }


    private expectPeek(t: TokenType) {
        if (this.peekTokenIs(t)) {
            this.nextToken();
            return true;
        } else {
            //this.peekError(t);
            return false;
        }
    }

    private currTokenIs(t: TokenType) {
        return this.currToken.type === t;
    }

    private peekTokenIs(t: TokenType) {
        return this.peekToken.type === t;
    }

    /*
    private peekError(t: TokenType) {
        const errorMsg = `Expected next token to be ${tokenTypeToString(t)}, but got ${tokenTypeToString(this.peekToken.type)} instead`;
        this.errors.push(errorMsg);
    }
    */


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

interface ParseOptions {
    throwOnError?: boolean;
}

export function parse(input: string, { throwOnError }: ParseOptions = {}) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();
    const errors = checkParserErrors(parser, !!throwOnError);

    return [program, errors] as [ast.Program, string[]];
}

export function checkParserErrors({ errors }: Parser, throwOnError = false) {
    if (errors.length) {
        let message = `Parser has ${errors.length} errors\n\n`;
        for (const error of errors) {
            message += `ERROR: ${error}\n`;
        }

        if (throwOnError) {
            throw new Error(message);
        } else {
            return errors;
        }
    }
}