
export enum TokenType {
    EOF,
    ILLEGAL,
  
    // Identifiers and literals
    IDENT, // foobar, add, x, y, etc.
    INT, // 12345
  
    // Operators
    ASSIGN,
    PLUS,
    MINUS,
    ASTERISK,
    SLASH,
    BANG,
    EQ,
    NOT_EQ,
    LT,
    GT,
  
    // Delimiters
    COMMA,
    SEMICOLON,
    LPAREN,
    RPAREN,
    LBRACE,
    RBRACE,
    LBRACKET,
    RBRACKET,
  
    // Keywords
    FUNCTION,
    LET,
    CONST,
    RETURN,
    IF,
    ELSE,
    TRUE,
    FALSE,
  }

  export function tokenTypeToString(tt: TokenType) {
    const tttsMap = new Map([
      [TokenType.EOF, "EOF"],
      [TokenType.ASSIGN, "ASSIGN"],
      [TokenType.SEMICOLON, "SEMICOLON"],
    ]);

    return tttsMap.get(tt);
  }
  
export interface Position {
  start: number;
  end: number;
}

  export interface Token {
    type: TokenType;
    literal: string;
    position: Position;
  }
  
  export function newToken(type: TokenType, text: string, position: Position): Token {
    return { type, literal: text, position: position || { start: -1, end: -1 } };
  }
  
  const keywords = new Map<string, TokenType>([
    ["fn", TokenType.FUNCTION],
    ["let", TokenType.LET],
    ["const", TokenType.CONST],
    ["return", TokenType.RETURN],
    ["if", TokenType.IF],
    ["else", TokenType.ELSE],
    ["true", TokenType.TRUE],
    ["false", TokenType.FALSE],
  ]);
  
  export function lookupIdentifer(text: string, position: Position) {
    const type = keywords.get(text) || TokenType.IDENT;
    return newToken(type, text, position);
  }