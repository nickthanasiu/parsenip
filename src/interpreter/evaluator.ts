import * as ast from "./ast";
import { Context } from "./context";
import * as obj from "./object";

export function evaluate(node: ast.Node, ctx: Context): obj.Object {
    switch (node.type) {

        // Statements
        case "program":
            return evalStatements(node.body, ctx);
        case "expressionStatement":
            return evaluate(node.expression, ctx);
        case "blockStatement":
            return evalStatements(node.statements, ctx);
        
            // Expressions
        case "ifExpression":
            return evalIfExpression(node, ctx);
        case "integerLiteral":
            return obj.integer(node.value);
        case "booleanLiteral":
            return nativeBoolToBooleanObject(node.value);
        case "stringLiteral":
            return obj.string(node.value);
        case "prefixExpression": {
            const right = evaluate(node.right, ctx);
            return evalPrefixExpression(node.operator, right);
        }
        case "infixExpression": {
            const left = evaluate(node.left, ctx);
            const right = evaluate(node.right, ctx);
            return evalInfixOperatorExpression(node.operator, left, right);
        }
        default:
            throw new Error(`unexpected node: '${JSON.stringify(node)}'`);
    }
}



function evalStatements(statements: ast.Statement[], ctx: Context) {
    let result!: obj.Object;

    for (const statement of statements) {
        result = evaluate(statement, ctx);

        if (result?.kind == "returnValue") {
            return result.value;
        }

        // @TODO: handle result.kind === "error"
    }

    return result;
}

function evalIfExpression(ifExpr: ast.IfExpression, ctx: Context) {
    const condition = evaluate(ifExpr.condition, ctx);

    if (isTruthy(condition)) {
        return evaluate(ifExpr.consequence, ctx);
    } else if (ifExpr.alternative) {
        return evaluate(ifExpr.alternative, ctx);
    } else {
        return obj.NULL;
    }
}

function isTruthy(condition: obj.Object) {
    switch (condition) {
        case obj.NULL:
            return false;
        case obj.TRUE:
            return true;
        case obj.FALSE:
            return false;
        default:
            return true;
    }
}

function evalPrefixExpression(operator: string, right: obj.Object) {
    switch (operator) {
        case "!":
            return evalBangOperatorExpression(right);
        case "-":
            return evalMinusPrefixOperatorExpression(right);
        default:
            return obj.NULL;
    }
}

function evalBangOperatorExpression(right: obj.Object) {
    switch (right.kind) {
        case "boolean":
            return right.value ? obj.FALSE : obj.TRUE;
        case "null":
            return obj.TRUE;
        default:
            return obj.FALSE;
    }
}

function evalMinusPrefixOperatorExpression(right: obj.Object) {
    if (right.kind !== "integer") {
        throw new Error(`unknown operator: -${right.kind}`);
    }

    return obj.integer(-right.value);
}

function evalInfixOperatorExpression(operator: string, left: obj.Object, right: obj.Object) {
    if (left.kind === "integer" && right.kind === "integer") {
        return evalIntegerInfixExpression(operator, left, right);
    }

    switch (operator) {
        case "==":
            return nativeBoolToBooleanObject(left === right);
        case "!=":
            return nativeBoolToBooleanObject(left != right);
        default:
            return obj.NULL;
}

function evalIntegerInfixExpression(operator: string, left: obj.Integer, right: obj.Integer) {
    const leftVal = left.value;
    const rightVal = right.value;

    switch (operator) {
        case "+":
            return obj.integer(leftVal + rightVal);
        case "-":
            return obj.integer(leftVal - rightVal);
        case "*":
            return obj.integer(leftVal * rightVal);
        case "/":
            return obj.integer(leftVal / rightVal);

        case ">":
            return nativeBoolToBooleanObject(leftVal > rightVal);
        case ">=":
            return nativeBoolToBooleanObject(leftVal >= rightVal);
        case "<":
            return nativeBoolToBooleanObject(leftVal < rightVal);
        case "<=":
            return nativeBoolToBooleanObject(leftVal <= rightVal);
        case "==":
            return nativeBoolToBooleanObject(leftVal == rightVal);
        case "!=":
            return nativeBoolToBooleanObject(leftVal != rightVal);
        default:
            return obj.NULL;
    }
}

function nativeBoolToBooleanObject(input: boolean): obj.Boolean {
    return input ? obj.TRUE : obj.FALSE;
}