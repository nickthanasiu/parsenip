import { Token, TokenType, newToken, lookupIdentifer } from "./token";

export interface Lexer {
  ch: string;
  position: number;
  input: string;
}

export class Lexer implements Lexer {

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.ch = "";

    this.readChar();
  }

  public readChar() {

    if (this.position >= this.input.length) {
      this.ch = TokenType.EOF;
    } else {
      this.ch = this.input[this.position];
    }

    this.position += 1;
  }

  public nextToken() {
    this.skipWhitespace();

    let token: Token;

    switch (this.ch) {
      case "=":
        token = newToken(TokenType.ASSIGN, "=");
        break;
      case "+":
        token = newToken(TokenType.PLUS, "+");
        break;
      case ",":
        token = newToken(TokenType.COMMA, ",");
        break;
      case ";":
        token = newToken(TokenType.SEMICOLON, ";");
        break;
      case "(":
        token = newToken(TokenType.LPAREN, "(");
        break;
      case ")":
        token = newToken(TokenType.RPAREN, ")");
        break;
      case "{":
        token = newToken(TokenType.LBRACE, "{");
        break;
      case "}":
        token = newToken(TokenType.RBRACE, "}");
        break;
      case "\0":
        token = newToken(TokenType.EOF, "\0");
        break;
      default:
        // Ch is either:
        // a letter (part of an Identifier or Keyword),
        if (this.isLetter(this.ch)) {
          token = this.readIdentifier();
          return token;
        } 
        // or a number (par of an INT)
        else if (this.isDigit(this.ch)) {
          token = this.readNumber();
          return token;
        }
        // or ILLEGAL, 
        else {
          token = newToken(TokenType.ILLEGAL, this.ch);
        }
    }

    this.readChar(); // Set this.ch, and move cursor position to next char
    return token;
  }

  readIdentifier() {

    let start = this.position - 1;

    while (this.isLetter(this.ch)) {
      this.readChar();
    }

    const text = this.input.slice(start, this.position - 1);
    return lookupIdentifer(text);
  }

  readNumber() {
    let start = this.position - 1;

    while (this.isDigit(this.ch)) {
      this.readChar();
    }

    const text = this.input.slice(start, this.position - 1);
    return newToken(TokenType.INT, text);
  }

  skipWhitespace() {
    const isWhitespace = (ch: string) =>
      ch === " " 
      || ch === "\n"
      || ch === "\r"
      || ch === "\t"
    ;

    while (isWhitespace(this.ch)) {
      this.readChar();
    }    
  }

  isLetter(char: string) {
    return 'a' <= char && char <= 'z' 
      || 'A' <= char && char <= 'Z';
  }

  isDigit(char: string) {
    return '0' <= char && char <= '9';
  }
}


export function lex(input: string) {
  const l = new Lexer(input);

  const tokens: Token[] = [];

  let token = l.nextToken();

  while (token.type !== TokenType.EOF) {
    tokens.push(token);
    token = l.nextToken();
  }

  tokens.push(newToken(TokenType.EOF, '\0'));

  return tokens;
};