import * as ast from "./ast";
import { Context } from "./context";
import * as obj from "./object";


export function evaluate(node: ast.Node, ctx: Context): obj.Object {
    switch (node.type) {

        // Statements
        case "program":
            return evalProgram(node, ctx);
        case "returnStatement":
            const val = evaluate(node.returnValue, ctx);
            return obj.returnValue(val);
        case "expressionStatement":
            return evaluate(node.expression, ctx);
        case "blockStatement":
            return evalBlockStatement(node, ctx);
        case "variableDeclaration":
            return evalVariableDeclaration(node, ctx);
        case "identifier":
            return evalIdentifier(node, ctx);

        case "functionExpression":
            const params = node.parameters;
            const body = node.body;
            return obj.functionExpr(params, body, ctx);

        case "callExpression":
            // @TODO: Error handling
            const func = evaluate(node.function, ctx);
            const args = evalExpressions(node.arguments, ctx);
            return applyFunction(func, args);

            // Expressions
        case "ifExpression":
            return evalIfExpression(node, ctx);
        case "integerLiteral":
            return obj.integer(node.value);
        case "booleanLiteral":
            return obj.nativeBoolToBooleanObject(node.value);
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

function evalIdentifier(identifier: ast.Identifier, ctx: Context) {
    const value = ctx.lookupVar(identifier.value);
    return value;

}

function evalBlockStatement(block: ast.BlockStatement, ctx: Context) {
    let result!: obj.Object;

    for (const statement of block.statements) {
        result = evaluate(statement, ctx);


        if (result && result.kind == "returnValue") {
            return result;
        }
    }

    return result;
}

function evalExpressions(expressions: ast.Expression[], ctx: Context) {
    // @TODO: Handle errors
    return expressions.map(expr => evaluate(expr, ctx));
}

function evalVariableDeclaration(varDeclaration: ast.VariableDeclaration, ctx: Context) {
    let val;

    if (varDeclaration.value) {
        val = evaluate(varDeclaration.value, ctx);
    }

    ctx.declareVar(varDeclaration.identifier.value, val);
    return val || obj.UNDEFINED;
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
            return obj.nativeBoolToBooleanObject(left === right);
        case "!=":
            return obj.nativeBoolToBooleanObject(left != right);
        default:
            return obj.NULL;
    }
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
            return obj.nativeBoolToBooleanObject(leftVal > rightVal);
        case ">=":
            return obj.nativeBoolToBooleanObject(leftVal >= rightVal);
        case "<":
            return obj.nativeBoolToBooleanObject(leftVal < rightVal);
        case "<=":
            return obj.nativeBoolToBooleanObject(leftVal <= rightVal);
        case "==":
            return obj.nativeBoolToBooleanObject(leftVal == rightVal);
        case "!=":
            return obj.nativeBoolToBooleanObject(leftVal != rightVal);
        default:
            return obj.NULL;
    }
}

function applyFunction(fn: obj.Object, args: obj.Object[]) {
    if (fn.kind !== "functionExpression") {
        throw `Expected a function to apply, you passed ${fn.kind}`;
    }

    const extendedEnv = extendFunctionEnv(fn, args);
    const evaluated = evaluate(fn.body, extendedEnv);

    return unwrapReturnValue(evaluated);
}

function extendFunctionEnv(fn: obj.FunctionExpr, args: obj.Object[]) {
    const env = new Context(fn.env);

    fn.parameters.forEach((param, paramIdx) => {
        env.declareVar(param.value, args[paramIdx]);
    });

    return env;
}

function unwrapReturnValue(obj: obj.Object) {
    if (obj.kind === "returnValue") {
        return obj.value;
    }

    return obj;
}