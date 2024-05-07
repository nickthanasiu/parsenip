import { Lexer } from "./lexer";
import * as ast from "./ast";
import { Token, TokenType, Position, PositionHelper } from "./token";

enum Precedence {
    LOWEST = 0,
    ASSIGN,
    EQUALS,
    LESS_GREATER,
    SUM,
    PRODUCT,
    PREFIX,
    CALL,
    INDEX,
};

const precedences = new Map<TokenType, Precedence>([
    [TokenType.EQ, Precedence.EQUALS],
    [TokenType.NOT_EQ, Precedence.EQUALS],
    [TokenType.LT, Precedence.LESS_GREATER],
    [TokenType.LTE, Precedence.LESS_GREATER],
    [TokenType.GT, Precedence.LESS_GREATER],
    [TokenType.GTE, Precedence.LESS_GREATER],
    [TokenType.PLUS, Precedence.SUM],
    [TokenType.MINUS, Precedence.SUM],
    [TokenType.ASTERISK, Precedence.PRODUCT],
    [TokenType.SLASH, Precedence.PRODUCT],
    [TokenType.LPAREN, Precedence.CALL],
    [TokenType.LBRACKET, Precedence.INDEX],
    [TokenType.ASSIGN, Precedence.ASSIGN],
]);

type prefixParseFn = () => ast.Expression | null;
type infixParseFn = (leftSideExpression: ast.Expression) => ast.Expression | null;

export interface Parser {
   lexer: Lexer;
   currToken: Token;
   peekToken: Token;
   errors: string[];
   testMode: boolean;
};

export class Parser implements Parser {

    private prefixParseFns = this.bindPrefixParseFns([
        [TokenType.IDENT, this.parseIdentifier],
        [TokenType.STRING, this.parseStringLiteral],
        [TokenType.INT, this.parseIntegerLiteral],
        [TokenType.BANG, this.parsePrefixExpression],
        [TokenType.MINUS, this.parsePrefixExpression],
        [TokenType.TRUE, this.parseBooleanLiteral],
        [TokenType.FALSE, this.parseBooleanLiteral],
        [TokenType.LBRACE, this.parseObjectExpression],
        [TokenType.LBRACKET, this.parseArrayLiteral],
        [TokenType.IF, this.parseIfExpression],
        [TokenType.FUNCTION, this.parseFunctionExpression], 
    ]);

    private infixParseFns = this.bindInfixParseFns([
        [TokenType.PLUS, this.parseInfixExpression],
        [TokenType.MINUS, this.parseInfixExpression],
        [TokenType.ASTERISK, this.parseInfixExpression],
        [TokenType.SLASH, this.parseInfixExpression],
        [TokenType.GT, this.parseInfixExpression],
        [TokenType.GTE, this.parseInfixExpression],
        [TokenType.LT, this.parseInfixExpression],
        [TokenType.LTE, this.parseInfixExpression],
        [TokenType.EQ, this.parseInfixExpression],
        [TokenType.NOT_EQ, this.parseInfixExpression],
        [TokenType.LPAREN, this.parseCallExpression],
        [TokenType.LBRACKET, this.parseMemberExpression],
        [TokenType.ASSIGN, this.parseAssignmentExpression],
    ]);

    constructor({ lexer, testMode }: { lexer: Lexer; testMode?: boolean }) {
        this.lexer = lexer;
        this.currToken = lexer.nextToken();
        this.peekToken  = lexer.nextToken();
        this.errors = [];
        this.testMode = testMode || false;
    }

    private createPosition(position: Position) {
        const pos = new PositionHelper({ testMode: this.testMode });
        return pos.setPosition(position);
    }

    private nextToken() {
        this.currToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    }

    public parseProgram() {
        const start = this.currToken.position.start;

        const statements: ast.Statement[] = [];

        while (!this.currTokenIs(TokenType.EOF)) {
            const statement = this.parseStatement();


            if (statement) {
                statements.push(statement);
            }

            this.nextToken();
        }

        return ast.program(statements, this.createPosition({
            start, end: this.currToken.position.end,
        }));
    }

    private parseStatement() {

        switch (this.currToken.type) {
            case TokenType.LET:
            case TokenType.CONST:
                return this.parseVariableDeclaration();
            case TokenType.FUNCTION:
                return this.parseFunctionDeclaration();
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
            this.createPosition(this.currToken.position)
        );

        if (this.expectPeek(TokenType.SEMICOLON)) {
            if (isConstant) {
                this.errors.push(`Must assign value to constant expression. No value provided`);
                return null;
            }

            return ast.variableDeclaration({
                constant: isConstant,
                identifier,
                position: this.createPosition({ start, end: this.currToken.position.end })
            });
        }

        if (!this.expectPeek(TokenType.ASSIGN)) {
            this.errors.push(`Expected assignment token following identifier in var declaration`);
            return null;
        }

        this.nextToken();

        const value = this.parseExpression(Precedence.LOWEST);

        if (!this.expectPeek(TokenType.SEMICOLON)) {
            this.errors.push(`Variable declaration statement must end with semicolon`);
            return null;
        }

        return ast.variableDeclaration({
            constant: isConstant,
            identifier,
            value,
            position: this.createPosition({ start, end: this.currToken.position.end }),
        });
    }

    private parseFunctionDeclaration() {
        const { start } = this.currToken.position;

        if (!this.expectPeek(TokenType.IDENT)) {
            this.errors.push(`Expected identifier following 'function' keyword`);
            return null;
        }

        const identifier = ast.identifier(this.currToken.literal, this.createPosition(this.currToken.position));

        if (!this.expectPeek(TokenType.LPAREN)) {
            this.errors.push(`Expected ( following identifier in function declaration`);
            return null;
        }

        const parameters = this.parseFunctionParameters();

        if (!this.expectPeek(TokenType.LBRACE)) {
            this.errors.push(`Expected { to follow paramters in function declaration`)
            return null;
        }

        const body = this.parseBlockStatement();
        const position = this.createPosition({ start, end: this.currToken.position.end });

        return ast.functionDeclaration({
            identifier,
            parameters,
            body,
            ...position
        });
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
        
        return ast.returnStatement(expression, this.createPosition({
            start,
            end: this.currToken.position.end
        }));
    }

    private parseExpressionStatement() {
        const start = this.currToken.position.start;
        const expression = this.parseExpression(Precedence.LOWEST);

        if (!expression) return null;
        
        if (this.peekTokenIs(TokenType.SEMICOLON)) {
            this.nextToken();
        }
        
        return ast.expressionStatement(expression, this.createPosition({
            start,
            end: this.currToken.position.end
        }));
    }

    private parseExpression(precedence: Precedence = Precedence.LOWEST) {
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

    private parseObjectExpression() {
        const start = this.currToken.position.start;

        const properties: ast.Property[] = [];

        while (!this.currTokenIs(TokenType.EOF) && !this.currTokenIs(TokenType.RBRACE)) {
            
            if (!this.expectPeek(TokenType.IDENT)) {
                this.errors.push(`Expected key of ObjectLiteral to be an identifier, but found token of type ${this.peekToken.type}`);
                return null;
            }

            const keyToken = this.currToken;
            const key = ast.identifier(keyToken.literal, this.createPosition(keyToken.position));
            const property = ast.property(key, key); // Until we explictly define a value for the key, we can just assume that the key and value are the same (e.g., { foo, } )

            this.nextToken();

            if (this.currTokenIs(TokenType.COMMA)) {
                this.nextToken(); // Move past COMMA
                properties.push(property);
                continue;
            } else if (this.currTokenIs(TokenType.RBRACE)) {
                properties.push(property);
                continue;
            }

            if (!this.currTokenIs(TokenType.COLON)) {
                this.errors.push(`Expected colon following Object literal key, but found ${this.peekToken.type}`);
                return null;
            }

            this.nextToken();
            property.value = this.parseExpression() as ast.Expression;
            properties.push(property);

            // Move past value IDENT token
            this.nextToken();

            if (this.currTokenIs(TokenType.COMMA)) {
                if (this.expectPeek(TokenType.RBRACE)) {
                    
                }
            }
        }


        if (!this.currTokenIs(TokenType.RBRACE)) {
            this.errors.push(`Object literal missing closing brace`);
            return null;
        }

        return ast.objectLiteral(properties, this.createPosition({
            start,
            end: this.currToken.position.end
        }));
    }


    // TODO: should we handle trailing commas?
    private parseArrayLiteral() {
        const { start } = this.currToken.position;

        const elements: ast.Expression[] = [];
        
        if (this.peekTokenIs(TokenType.RBRACKET)) {
            this.nextToken();
            const position = this.createPosition({
                start, end: this.currToken.position.end
            });

            return ast.arrayLiteral({
                elements,
                ...position
            });
        }

        this.nextToken();
        elements.push(this.parseExpression() as ast.Expression);
        
        while (this.peekTokenIs(TokenType.COMMA)) {
            this.nextToken();
            this.nextToken();
            elements.push(this.parseExpression() as ast.Expression);
        }
        
        if (!this.expectPeek(TokenType.RBRACKET)) {
            this.errors.push(`Expected array literal to have closing bracket`);
            return null;
        }

        const position = this.createPosition({
            start, end: this.currToken.position.end
        });

        return ast.arrayLiteral({
            elements,
            ...position
        });
    }

    private parsePrefixExpression() {
        const start = this.currToken.position.start;
        const prefixOperator = this.currToken.literal;
        this.nextToken();
        const right = this.parseExpression(Precedence.PREFIX)

        if (!right) {
            return null;
        }
        
        return ast.prefixExpression({
            operator: prefixOperator,
            right,
            position: this.createPosition({
                start,
                end: this.currToken.position.end
            })
        });
    }

    private parseInfixExpression(left: ast.Expression) {
        const start = this.currToken.position.start;
        const operator = this.currToken.literal;
        const precedence = this.currPrecedence();
        this.nextToken();
        const right = this.parseExpression(precedence);

        if (!right) return null;

        return ast.infixExpression({
            left,
            operator,
            right,
            position: this.createPosition({
                start,
                end: this.currToken.position.end
            })
        });
    }

    private parseIfExpression() {

        const start = this.currToken.position.start;

        if (!this.expectPeek(TokenType.LPAREN)) {
            this.errors.push(`Expected ( following "if" keyword`);
            return null;
        }

        this.nextToken();
        const condition = this.parseExpression() as ast.Expression;

        if (!this.expectPeek(TokenType.RPAREN)) {
            this.errors.push(`Expected ) following condition expresssion`);
            return null;
        }

        if (!this.expectPeek(TokenType.LBRACE)) {
            this.errors.push(`Expected { to begin block statement`);
            return null;
        }

        const consequence = this.parseBlockStatement();
        let alternative;

        if (this.expectPeek(TokenType.ELSE)) {
            
            if (!this.expectPeek(TokenType.LBRACE)) {
                this.errors.push(`Expected { to begin block statement`);
                return null;
            }

            alternative = this.parseBlockStatement();
        }

        const position = this.createPosition({
            start, end: this.currToken.position.end
        });

        return ast.ifExpression({
            condition,
            consequence,
            alternative,
            ...position
        });
    }

    private parseBlockStatement() {
        const start = this.currToken.position.start;

        const blockStatements: ast.Statement[] = [];

        this.nextToken();

        while (!this.currTokenIs(TokenType.RBRACE) && !this.currTokenIs(TokenType.EOF)) {
            const stmt = this.parseStatement();

            if (stmt) {
                blockStatements.push(stmt);
            }

            this.nextToken();
        }


        return ast.blockStatement(blockStatements, this.createPosition({
            start, end: this.currToken.position.end,
        }));
    }

    private parseFunctionExpression() {
        const { start } = this.currToken.position;

        if (!this.expectPeek(TokenType.LPAREN)) {
            this.errors.push(`Expected ( following 'function' keyword`);
            return null;
        }

        const parameters = this.parseFunctionParameters();

        if (!this.expectPeek(TokenType.LBRACE)) {
            this.errors.push(`Expected {`); // TODO: Improve error message
            return null;
        }

        const body = this.parseBlockStatement();
        const position = this.createPosition({
            start, end: this.currToken.position.end
        });

        const functionExpression = ast.functionExpression({
            parameters,
            body,
            ...position
        });

        return functionExpression;
    }

    private parseFunctionParameters() {
        const identifiers: ast.Identifier[] = [];

        this.nextToken();

        while (!this.currTokenIs(TokenType.RPAREN)) {
            const ident = ast.identifier(
                this.currToken.literal,
                this.createPosition(this.currToken.position)
            );

            identifiers.push(ident);
            this.nextToken();

            if (this.currTokenIs(TokenType.COMMA)) {
                this.nextToken();
            }
        }

        return identifiers;
    }

    private parseAssignmentExpression(left: ast.Expression) {
        const start = left.start;
        const operator = this.currToken.literal;

        if (operator != "=") {
            this.errors.push(`Invalid assignment operator ${operator}`);
            return null;
        }

        this.nextToken();

        const right = this.parseExpression() as ast.Expression;
        return ast.assignmentExpression(
            operator,
            left,
            right,
            this.createPosition({ start, end: this.currToken.position.end })
        );
    }

    private parseIdentifier() {
        return ast.identifier(
            this.currToken.literal,
            this.createPosition(this.currToken.position)
        );
    }

    private parseCallExpression(fn: ast.Expression) {
        const args = this.parseArguments();

        const position = this.createPosition({
            start: fn.start, end: this.currToken.position.end
        });

        return ast.callExpression({
            function: fn,
            arguments: args,
            ...position
        })
    }

    private parseArguments() {
        const args: ast.Expression[] = [];

        this.nextToken();

        while (!this.currTokenIs(TokenType.RPAREN)) {
            const arg = this.parseExpression() as ast.Expression;
            args.push(arg);
            this.nextToken();

            if (this.currTokenIs(TokenType.COMMA)) {
                this.nextToken();
            }
        }

        return args;
    }

    

    private parseMemberExpression(left: ast.Expression) {
        const start = this.currToken.position.start;
        this.nextToken();
        const index = this.parseExpression() as ast.Expression;

        if (!this.expectPeek(TokenType.RBRACKET)) {
            this.errors.push(`Expected ] at end of memberExpression`);
            return null;
        }


        return ast.memberExpression(
            left,
            index,
            this.createPosition({ start, end: this.currToken.position.end })
        );
    }

    private parseStringLiteral() {
        const { literal, position } = this.currToken;

        return ast.stringLiteral(literal, this.createPosition(position));
    }

    private parseIntegerLiteral() {
        const { literal, position: { start } } = this.currToken;
        const int = Number(literal);

        if (isNaN(int)) {  // @TODO is this the best way to parse/validate numbers?
            const errorMsg = `Could not parse ${literal} as integer`;
            this.errors.push(errorMsg);
            return null;
        }

        return ast.integerLiteral(
            int,
            this.createPosition({ start, end: this.currToken.position.end })
        );
    }

    private parseBooleanLiteral() {
        return ast.booleanLiteral(
            this.currTokenIs(TokenType.TRUE),
            this.createPosition(this.currToken.position)
        );
    }

    /*
    private expect(t: TokenType) {
        if (this.currTokenIs(t)) {
            this.nextToken();
            return this.currToken;
        } else {
            this.errors.push(`
                Expected next token to be ${tokenTypeToString(t)},
                 but got ${tokenTypeToString(this.peekToken.type)} instead
            `);
            return null;
        }
    }

    */

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
    private expectError(t: TokenType) {
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
    testMode?: boolean;
}

export function parse(input: string, { throwOnError, testMode }: ParseOptions = {}) {
    const lexer = new Lexer(input);
    const parser = new Parser({ lexer, testMode });

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