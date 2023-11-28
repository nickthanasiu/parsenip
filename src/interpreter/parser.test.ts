import { Lexer } from "./lexer";
import { Parser } from "./parser";
import * as ast from "./ast";

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

    const l = new Lexer(input);
    const p = new Parser(l);

    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program).toStrictEqual(expected);
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

    const l = new Lexer(input);
    const p = new Parser(l);

    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program).toStrictEqual(expected);
});