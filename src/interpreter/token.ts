
export enum TokenType {
    EOF = "EOF",
    ILLEGAL = "ILLEGAL",
  
    // Identifiers and literals
    IDENT = "IDENT", // foobar, add, x, y, etc.
    INT = "INT", // 12345
    STRING = "STRING",
  
    // Operators
    ASSIGN = "ASSIGN",
    PLUS = "PLUS",
    MINUS = "MINUS",
    ASTERISK = "ASTERISK",
    SLASH = "SLASH",
    BANG = "BANG",
    EQ = "EQ",
    NOT_EQ = "NOT_EQ",
    LT = "LT",
    GT = "GT",
    LTE = "LTE",
    GTE = "GTE",
    AND = "AND",
    OR = "OR",
  
    // Delimiters
    COMMA = "COMMA",
    COLON = "COLON",
    SEMICOLON = "SEMICOLON",
    LPAREN = "LPAREN",
    RPAREN  = "RPAREN",
    LBRACE = "LBRACE",
    RBRACE = "RBRACE",
    LBRACKET = "LBRACKET",
    RBRACKET = "RBRACKET",
  
    // Keywords
    FUNCTION = "FUNCTION",
    LET = "LET",
    CONST = "CONST",
    RETURN = "RETURN",
    IF = "IF",
    ELSE = "ELSE",
    TRUE = "TRUE",
    FALSE = "FALSE",
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
    ["function", TokenType.FUNCTION],
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