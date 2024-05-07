import { DEFAULT_POSITION, Position } from "./token";

export type Node = Expression | Statement | Program;

////////////////
// Expressions
////////////////

export type Expression = 
    | Identifier
    | PrefixExpression
    | InfixExpression
    | IfExpression
    | FunctionExpression
    | CallExpression
    | MemberExpression
    | AssignmentExpression

    // Literals
    | StringLiteral
    | IntegerLiteral
    | BooleanLiteral
    | Property
    | ObjectLiteral
    | ArrayLiteral
;

export interface Identifier extends Position {
    type: "identifier",
    value: string;
};

export function identifier(value: string, position: Position = DEFAULT_POSITION): Identifier {
    return {
        type: "identifier",
        value,
        ...position,
    }
}

export interface StringLiteral extends Position {
    type: "stringLiteral";
    value: string;
}

export const stringLiteral = (value: string, position: Position = DEFAULT_POSITION): StringLiteral => ({
    type: "stringLiteral",
    value,
    ...position
});

export interface IntegerLiteral extends Position {
    type: "integerLiteral";
    value: number;
}

export function integerLiteral(value: number, position: Position = DEFAULT_POSITION): IntegerLiteral {
    return {
        type: "integerLiteral",
        value,
        ...position
    };
}

export interface BooleanLiteral extends Position {
    type: 'booleanLiteral';
    value: boolean;
}


export function booleanLiteral(value: boolean, position: Position = DEFAULT_POSITION): BooleanLiteral {
    return {
        type: "booleanLiteral",
        value,
        ...position
    }
}

export interface Property extends Position {
    type: "property",
    key: Identifier,
    value?: Expression
}

export function property(key: Identifier, value?: Expression): Property {
    return {
        type: "property",
        start: key.start,
        end: value?.end ?? key.end,
        key,
        value,
    }
}

export interface ObjectLiteral extends Position {
    type: "objectLiteral",
    properties: Property[]
}

export function objectLiteral(properties: Property[], position: Position): ObjectLiteral {
    return {
        type: "objectLiteral",
        ...position,
        properties,
    }
}

export interface ArrayLiteral extends Position {
    type: "arrayLiteral";
    elements: Expression[];
}

export const arrayLiteral = (props: WithoutType<ArrayLiteral>): ArrayLiteral => ({
    type: "arrayLiteral",
    elements: props.elements,
    ...positionFromProps(props)
});

export interface MemberExpression extends Position {
    type: "memberExpression";
    left: Expression;
    index: Expression
}

export function memberExpression(left: Expression, index: Expression, position: Position): MemberExpression {
    return {
        type: "memberExpression",
        ...position,
        left,
        index,
    }
}

export interface AssignmentExpression extends Position {
    type: "assignmentExpression";
    operator: "="; // @TODO: Later on we may support other types of assignment operators such as +=, -=, etc.
    left: Expression;
    right: Expression;
}

export function assignmentExpression(
    operator: "=",
    left: Expression,
    right: Expression,
    position: Position
): AssignmentExpression {
    return {
        type: "assignmentExpression",
        operator,
        left,
        right,
        ...position
    };
}

export interface PrefixExpression extends Position {
    type: "prefixExpression";
    operator: string;
    right: Expression;
}

export function prefixExpression(props: {operator: string, right: Expression, position?: Position}): PrefixExpression {
    const { operator, right, position } = props;
    return {
        type: "prefixExpression",
        operator,
        right,
        ...(position || DEFAULT_POSITION)
    }
}

interface InfixExpression extends Position {
    type: "infixExpression";
    left: Expression;
    operator: string;
    right: Expression;
}

export function infixExpression(props: {
    left: Expression,
    operator: string,
    right: Expression,
    position?: Position
}): InfixExpression {

    const { left, operator, right, position } = props;

    return {
        type: "infixExpression",
        left,
        operator,
        right,
        ...(position || DEFAULT_POSITION)
    };
}

type WithoutType<T> = Omit<T, "type">;

export interface IfExpression extends Position {
    type: "ifExpression";
    condition: Expression;
    consequence: BlockStatement;
    alternative?: BlockStatement;
}

export const ifExpression = (props: WithoutType<IfExpression>): IfExpression => ({
    type: "ifExpression",
    condition: props.condition,
    consequence: props.consequence,
    alternative: props.alternative,
    start: props.start,
    end: props.end
});

export interface FunctionExpression extends Position {
    type: "functionExpression";
    parameters: Identifier[];
    body: BlockStatement;
}

export const functionExpression = (props: WithoutType<FunctionExpression>): FunctionExpression => ({
    type: "functionExpression",
    parameters: props.parameters,
    body: props.body,
    start: props.start,
    end: props.end
});

export type CallExpression = WithPosition<{
    type: "callExpression";
    function: Expression;
    arguments: Expression[];
}>;

type WithPosition<T> = T & Position;

function positionFromProps(props: WithoutType<Node>): Position {
    const { start, end } = props;
    return { start, end };
}

export const callExpression = (props: WithoutType<CallExpression>): CallExpression => ({
    type: "callExpression",
    function: props.function,
    arguments: props.arguments,
    ...positionFromProps(props)
});

////////////////
// Statements
////////////////

export type Statement =
    | VariableDeclaration
    | FunctionDeclaration
    | ReturnStatement
    | ExpressionStatement
    | BlockStatement
    | ForStatement
;

export interface VariableDeclaration extends Position {
    type: "variableDeclaration";
    constant: boolean;
    identifier: Identifier;
    value?: Expression | null;
}

export function variableDeclaration(props: {
    constant: boolean,
    identifier: Identifier,
    value?: Expression | null,
    position?: Position
}): VariableDeclaration {

    const { constant, position, identifier, value } = props;

    return {
        type: "variableDeclaration",
        ...(position || DEFAULT_POSITION),
        constant,
        identifier,
        value,
    }
}

export interface FunctionDeclaration extends Position {
    type: "functionDeclaration",
    identifier: Identifier,
    parameters: Identifier[],
    body: BlockStatement
}

export const functionDeclaration = (props: WithoutType<FunctionDeclaration>): FunctionDeclaration => ({
    type: "functionDeclaration",
    identifier: props.identifier,
    parameters: props.parameters,
    body: props.body,
    start: props.start,
    end: props.end,
});

export interface ReturnStatement extends Position {
    type: "returnStatement";
    returnValue: Expression;
}

export function returnStatement(expression: Expression, position: Position = DEFAULT_POSITION): ReturnStatement {
    return {
        type: "returnStatement",
        ...position,
        returnValue: expression
    };
}

export interface ExpressionStatement extends Position {
    type: "expressionStatement";
    expression: Expression;
}

export function expressionStatement(expression: Expression, position: Position = DEFAULT_POSITION): ExpressionStatement {
    return {
        type: "expressionStatement",
        ...position,
        expression
    }
}

export interface BlockStatement extends Position {
    type: "blockStatement";
    statements: Statement[];
}

export function blockStatement(statements: Statement[], position: Position): BlockStatement {
    return {
        type: "blockStatement",
        ...position,
        statements
    };
}


export interface ForStatement extends Position {
    type: "forStatement",
    init: VariableDeclaration,
    limit: ExpressionStatement
}


////////////////
// Program
////////////////

export interface Program extends Position {
    type: "program";
    body: Statement[];
}

export function program(statements: Statement[] = [], position: Position = DEFAULT_POSITION): Program {
    return {
        type: "program",
        body: statements,
        ...position,
    };
}
