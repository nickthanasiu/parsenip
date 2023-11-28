export enum TokenType {
    EOF = "\0",
    ILLEGAL = "ILLEGAL",
  
    // Identifiers and literals
    IDENT = "IDENT", // foobar, add, x, y, etc.
    INT = "INT", // 12345
  
    // Operators
    ASSIGN = "=",
    PLUS = "+",
  
    // Delimiters
    COMMA = ",",
    SEMICOLON = ";",
  
    LPAREN = "(",
    RPAREN = ")",
    LBRACE = "{",
    RBRACE = "}",
  
    // Keywords
    FUNCTION = "FUNCTION",
    LET = "LET",
    RETURN = "RETURN",
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
  ]);
  
  export function lookupIdentifer(text: string) {
    const type = keywords.get(text) || TokenType.IDENT;
    return newToken(type, text);
  
  
  }