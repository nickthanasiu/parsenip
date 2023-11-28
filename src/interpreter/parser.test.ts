import { Lexer } from "./lexer";
import { Parser } from "./parser";
import * as ast from "./ast";
import { TokenType, newToken } from "./token";

test('First parser test', () => {

    const x_token = newToken(TokenType.IDENT, "x");
    const y_token = newToken(TokenType.IDENT, "y");
    const foobar_token = newToken(TokenType.IDENT, "foobar");

    const expected = new ast.Program([
        new ast.LetStatement(ast.identifier(x_token, "x")),
        new ast.LetStatement(ast.identifier(y_token, "y")),
        new ast.LetStatement(ast.identifier(foobar_token, "foobar")),
    ]);

    const input = `
        let x = 5;
        let y = 10;

        let foobar = 838383;
    `;

    const l = new Lexer(input);
    const p = new Parser(l);

    const program = p.parseProgram();
    checkErrors(p);

    expect(program).toStrictEqual(expected);
});

function checkErrors({ errors }: Parser) {
    if (errors.length) {
        let message = `Parser has ${errors.length} errors\n\n`;
        for (const error of errors) {
            message += `ERROR: ${error}'\n')`;
        }

        throw new Error(message);
    }

}