import { Lexer, lex } from "./lexer";
import { Token, TokenType } from "./token";

test('Calling readChar advances pointer', () => {
  const input = "{};"
  const l = new Lexer(input);

  const startingPosition = l.position;
  l.readChar();

  expect(l.position).toBe(startingPosition + 1);
});

test(`readChar sets ch to "\0 when finished reading all input`, () => {
  const input = "{};";
  const l = new Lexer(input);

  for (let i = 0; i < input.length; i++) {
    l.readChar();
  }

  expect(l.ch).toBe("\0");
});

test(`nextToken works`, () => {
  const input = `let five = 5;`;

  const expectedTokens: Token[] = [
    { type: TokenType.LET, literal: "let" },
    { type: TokenType.IDENT, literal: "five" },
    { type: TokenType.ASSIGN, literal: "=" },
    { type: TokenType.INT, literal: "5" },
    { type: TokenType.SEMICOLON, literal: ";" },
    { type: TokenType.EOF, literal: "\0" },
  ];

  const tokens = lex(input);

  expect(tokens).toStrictEqual(expectedTokens);
});