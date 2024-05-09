
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
    DOT = "DOT",
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


export interface Position {
  start: number;
  end: number;
}

export const DEFAULT_POSITION: Position = { start: -1, end: -1 };

export class PositionHelper implements Position {

  start: number; end: number;
  testMode: boolean;

  constructor({ testMode }: { testMode: boolean }) {
    this.start = DEFAULT_POSITION.start;
    this.end = DEFAULT_POSITION.end;
    this.testMode = testMode;
  }

  public setPosition({ start, end }: Position): Position {
    if (!this.testMode) {
      this.start = start;
      this.end = end;
    }

    return { start: this.start, end: this.end };
  }
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
  
  export function lookupIdentiferType(text: string) {
    return keywords.get(text) || TokenType.IDENT;
  }