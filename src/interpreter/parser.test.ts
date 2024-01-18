import { Lexer } from "./lexer";
import { Parser } from "./parser";
import * as ast from "./ast";

test('Parse let statements', () => {

    const input = `
        let myVar;
        let x = 5;
        let y = 10;

        let foobar = 838383;
    `;

    const expected = ast.program([
        ast.variableDeclaration(false, ast.identifier("myVar")),
        ast.variableDeclaration(false, ast.identifier("x"), ast.integerLiteral(5)),
        ast.variableDeclaration(false, ast.identifier("y"), ast.integerLiteral(10)),
        ast.variableDeclaration(false, ast.identifier("foobar"), ast.integerLiteral(838383)),
    ]);

    const actual = parse(input);

    expect(actual).toStrictEqual(expected);
});



test('Parse const statements', () => {
    const input  = `
        const myVar = 100;
        let foo;
    `;

    const expected = ast.program([
        ast.variableDeclaration(true, ast.identifier("myVar"), ast.integerLiteral(100)),
        ast.variableDeclaration(false, ast.identifier("foo")),
    ]);

    const actual = parse(input);

    expect(actual).toStrictEqual(expected);
});

test('Parse return statements', () => {
    
    const input = `
        return 5;
        return 10;
        return 993322;
        return true;
        return false;
    `;

    const expected = ast.program([
        ast.returnStatement(ast.integerLiteral(5)),
        ast.returnStatement(ast.integerLiteral(10)),
        ast.returnStatement(ast.integerLiteral(993322)),
        ast.returnStatement(ast.booleanLiteral(true)),
        ast.returnStatement(ast.booleanLiteral(false)),
    ]);

    const actual = parse(input);

    expect(actual).toStrictEqual(expected);
});

test('Parse integer literals', () => {
    const expected = ast.program([
        ast.expressionStatement(ast.integerLiteral(5))
    ]);

    const input = "5";
    const actual = parse(input);

    expect(actual).toStrictEqual(expected);
});

test('Parse prefix expressions', () => {
    
    const expected = [
        // !5;
        ast.program([
            ast.expressionStatement(
                ast.prefixExpression("!", ast.integerLiteral(5))
            ),
        ]),
        // -15
        ast.program([
            ast.expressionStatement(
                ast.prefixExpression("-", ast.integerLiteral(15))
            )
        ]),
        // !true
        ast.program([
            ast.expressionStatement(
                ast.prefixExpression("!", ast.booleanLiteral(true))
            )
        ]),
        // !false
        ast.program([
            ast.expressionStatement(
                ast.prefixExpression("!", ast.booleanLiteral(false))
            )
        ]),
    ];

    const inputs = [
        "!5;",
        "-15;",
        "!true;",
        "!false;",
    ];

    const actual = inputs.map(parse);

    expect(actual).toStrictEqual(expected);
});

test('Parse infix expressions', () => {
    const operators = ["+", "-", "*", "/", ">", "<", /* "==", "!="*/];

    const expected = operators.map(operator => {
        return ast.program([
            ast.expressionStatement(
                ast.infixExpression(
                    ast.integerLiteral(5),
                    operator,
                    ast.integerLiteral(5),
                )
            )
        ]);
    })

    const actual = operators.map(operator => parse(`5 ${operator} 5;`));

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


function checkParserErrors({ errors }: Parser) {
    if (errors.length) {
        let message = `Parser has ${errors.length} errors\n\n`;
        for (const error of errors) {
            message += `ERROR: ${error}'\n')`;
        }

        throw new Error(message);
    }
}