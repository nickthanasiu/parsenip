
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
  
    // Keywords
    FUNCTION,
    LET,
    RETURN,
    IF,
    ELSE,
    TRUE,
    FALSE,
  }
  
  export interface Token {
    type: TokenType;
    literal: string;
  }
  
  export function newToken(type: TokenType, text: string): Token {
    return { type, literal: text };
  }
  
  const keywords = new Map<string, TokenType>([
    ["fn", TokenType.FUNCTION],
    ["let", TokenType.LET],
    ["return", TokenType.RETURN],
    ["if", TokenType.IF],
    ["else", TokenType.ELSE],
    ["true", TokenType.TRUE],
    ["false", TokenType.FALSE],
  ]);
  
  export function lookupIdentifer(text: string) {
    const type = keywords.get(text) || TokenType.IDENT;
    return newToken(type, text);
  }