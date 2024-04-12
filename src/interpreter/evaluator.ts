import * as ast from "./ast";
import { Context } from "./context";
import * as obj from "./object";

export function evaluate(node: ast.Node, ctx: Context): obj.Object {
    switch (node.type) {

        // Statements
        case "program":
            return evalProgram(node, ctx);
        case "expressionStatement":
            return evaluate(node.expression, ctx);

        // Expressions
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



function evalProgram(program: ast.Program, ctx: Context) {
    let result!: obj.Object;

    for (const statement of program.body) {
        result = evaluate(statement, ctx);

        if (result?.kind == "returnValue") {
            return result.value;
        }

        // @TODO: handle result.kind === "error"
    }

    return result;
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
    return input ? obj.TRUE : obj.FALSE
}