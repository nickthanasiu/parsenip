import { Lexer } from "./lexer";
import { Parser } from "./parser";
import * as ast from "./ast";
import { TokenType, newToken } from "./token";

test('Parse let statements', () => {

    const input = `
        let x = 5;
        let y = 10;

        let foobar = 838383;
    `;

    const expected = ast.program([
        ast.letStatement(ast.identifier("x")),
        ast.letStatement(ast.identifier("y")),
        ast.letStatement(ast.identifier("foobar")),
    ]);

    const actual = parse(input);

    expect(actual).toStrictEqual(expected);
});

function checkParserErrors({ errors }: Parser) {
    if (errors.length) {
        let message = `Parser has ${errors.length} errors\n\n`;
        for (const error of errors) {
            message += `ERROR: ${error}'\n')`;
        }

        throw new Error(message);
    }

}

test('Parse return statements', () => {
    
    const input = `
        return 5;
        return 10;
        return 993322;
    `;

    const expected = ast.program([
        ast.returnStatement(),
        ast.returnStatement(),
        ast.returnStatement(),
    ]);

    const actual = parse(input);

    expect(actual).toStrictEqual(expected);
});

test('Parse integer literals', () => {
    const expected = ast.program([
        ast.expressionStatement(newToken(TokenType.INT, "5"), ast.integerLiteral(5))
    ]);

    const input = "5";
    const actual = parse(input);

    expect(actual).toStrictEqual(expected);
});

test('Parse prefix expressions', () => {
    const expected = [
        ast.program([
            // !5;
            ast.expressionStatement(
                newToken(TokenType.BANG, "!"),
                ast.prefixExpression(newToken(TokenType.BANG, "!"), ast.integerLiteral(5))
            ),
        ]),
        ast.program([
            ast.expressionStatement(
                newToken(TokenType.MINUS, "-"),
                ast.prefixExpression(newToken(TokenType.MINUS, "-"), ast.integerLiteral(15))
            )
        ]),

        /*
        ast.program([
            ast.expressionStatement(
                newToken(TokenType.BANG, "!"),
                ast.prefixExpression(newToken(TokenType.BANG, "!"), ast.booleanLiteral(true))
            )
        ]),
        ast.program([
            ast.expressionStatement(
                newToken(TokenType.BANG, "!"),
                ast.prefixExpression(newToken(TokenType.BANG, "!"), ast.booleanLiteral(false))
            )
        ]),
        */
    ];


    const inputs = [
        "!5;",
        "-15;",
        //"!true",
        //"!false",
    ];

    const actual = inputs.map(parse);

    console.log('ACTUAL ', actual);

    expect(actual).toStrictEqual(expected);
});


// Helper for parser tests
function parse(input: string) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);
    return program;
}