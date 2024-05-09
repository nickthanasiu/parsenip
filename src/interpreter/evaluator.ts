import * as ast from "./ast";
import { Environment } from "./environment";
import * as obj from "./object";

export function evaluate(node: ast.Node, env: Environment): obj.Object {
    switch (node.type) {

        // Statements
        case "program":
            return evalProgram(node, env);
        case "returnStatement":
            const val = evaluate(node.returnValue, env);
            return obj.returnValue(val);
        case "expressionStatement":
            return evaluate(node.expression, env);
        case "blockStatement":
            return evalBlockStatement(node, env);
        case "variableDeclaration":
            return evalVariableDeclaration(node, env);
        case "identifier":
            return evalIdentifier(node, env);
        case "functionExpression":
            return obj.functionExpr(node.parameters, node.body, env);
        case "functionDeclaration":
            return evalFunctionDeclaration(node, env);
        case "callExpression":
            // @TODO: Error handling
            const func = evaluate(node.function, env);
            const args = evalExpressions(node.arguments, env);
            return applyFunction(func, args);

        case "memberExpression":
            return evalMemberExpression(node, env);

        case "assignmentExpression":
            return evalAssignmentExpression(node, env);

            // Expressions
        case "ifExpression":
            return evalIfExpression(node, env);
        case "integerLiteral":
            return obj.integer(node.value);
        case "booleanLiteral":
            return obj.nativeBoolToBooleanObject(node.value);
        case "stringLiteral":
            return obj.string(node.value);
        case "objectLiteral":
            return obj.objectLiteral(node.properties);
        case "arrayLiteral":
            return obj.arrayLiteral(node.elements);
        case "prefixExpression": {
            const right = evaluate(node.right, env);
            return evalPrefixExpression(node.operator, right);
        }
        case "infixExpression": {
            const left = evaluate(node.left, env);
            const right = evaluate(node.right, env);
            return evalInfixOperatorExpression(node.operator, left, right);
        }
        default:
            throw new Error(`unexpected node: '${JSON.stringify(node)}'`);
    }
}



function evalProgram(program: ast.Program, env: Environment) {
    let result!: obj.Object;

    for (const statement of program.body) {
        result = evaluate(statement, env);

        if (result?.kind == "returnValue") {
            return result.value;
        }

        // @TODO: handle result.kind === "error"
    }

    return result;
}

function evalIdentifier(identifier: ast.Identifier, env: Environment) {
    const value = env.lookupVar(identifier.value);
    return value;

}

function evalBlockStatement(block: ast.BlockStatement, env: Environment) {
    let result!: obj.Object;

    for (const statement of block.statements) {
        result = evaluate(statement, env);


        if (result && result.kind == "returnValue") {
            return result;
        }
    }

    return result;
}

function evalExpressions(expressions: ast.Expression[], env: Environment) {
    // @TODO: Handle errors
    return expressions.map(expr => evaluate(expr, env));
}

function evalVariableDeclaration(varDeclaration: ast.VariableDeclaration, env: Environment) {
    let val: obj.Object | undefined;

    if (varDeclaration.value) {
        val = evaluate(varDeclaration.value, env);
    }

    return env.declareVar(varDeclaration.identifier.value, val);
}

function evalFunctionDeclaration(functionDec: ast.FunctionDeclaration, env: Environment) {
    const { identifier, parameters, body } = functionDec;

    const functionDecObj = obj.functionDec(identifier, parameters, body, env);
    env.declareVar(identifier.value, functionDecObj);

    return functionDecObj;
}

function evalMemberExpression(memberExpr: ast.MemberExpression, env: Environment) {
    const left = evaluate(memberExpr.left, env);
    
    if (left.kind === "objectLiteral") {
        return evalObjectMemberExpression(left, memberExpr.index, env);
    }

    if (left.kind === "arrayLiteral") {
        return evalArrayMemberExpression(left, memberExpr.index, env);
    }

    // @TODO: This is NOT how JavaScript handles this, but it will do for now
    throw `Cannot use member expression on ${left.kind}`;    
}

function evalObjectMemberExpression(objLiteral: obj.ObjectLiteral, keyExpression: ast.Expression, env: Environment) {
    // If keyExpression is an identifer, we don't need to evaluate it.
    // If it's an expression, we do need to evaluate
    // For now let's assume that if keyExpression is not an identifier, it must be an expression
    // @TODO: There may be some weird edge cases where this let's us use some unwanted values here, and we get useless/vague errors
    //        Let's worry about that later

    let key: obj.String;

    if (keyExpression.type !== "identifier") {
        const evaluatedExpression = evaluate(keyExpression, env);

        if (evaluatedExpression.kind !== "string") {
            // @TODO: This is NOT how JavaScript handles this, but it will do for now
            throw `Object key must be a string`;
        }

        key = evaluatedExpression;
    } else {
        key = obj.string(keyExpression.value);
    }

    const matchingProp = objLiteral.properties.find(p => p.key.value == key.value);

    if (!matchingProp?.value) {
        return obj.UNDEFINED;
    }

    return evaluate(matchingProp.value, env);
}

function evalArrayMemberExpression(arrayLiteral: obj.ArrayLiteral, indexExpression: ast.Expression, env: Environment) {
    const indexObj = evaluate(indexExpression, env);
    
    if (indexObj.kind !== "integer") {
        // @TODO: Make sure floats, (i.e, non-integer numbers) can't end up here
        throw `Array index must be an integer`;
    }

    const foundExpression = arrayLiteral.elements[indexObj.value];

    if (!foundExpression) {
        return obj.UNDEFINED;
    }

    return evaluate(foundExpression, env);
}

function evalAssignmentExpression(node: ast.AssignmentExpression, env: Environment) {
    const { operator, left, right } = node;

    if (operator != "=") {
        throw(`evalAssignmentExpression: received invalid assignment operator ${operator}`);
    }

    switch (left.type) {
        case "identifier":
            const rightVal = evaluate(right, env);
            env.assignVar(left.value, rightVal);
            return rightVal;
        case "memberExpression":
            const memberExpr = left;
            
            if (memberExpr.left.type !== "identifier") {
                throw (`Only handles identifiers for now...`);
            }

            const varName = memberExpr.left.value;
            const found = env.lookupVar(memberExpr.left.value);

            if (found.kind !== "objectLiteral" && found.kind !== "arrayLiteral") {
                throw `Only handles objectLiterals for now...`;
            }

            if (!found) {
                throw `${memberExpr.left.value} not defined.`;
            }

            if (found.kind === "arrayLiteral") {
                const arr = found;
                const index = evaluate(memberExpr.index, env);
                if (index.kind !== "integer") {
                    throw `Index should be integer. Received ${index.kind}`; // @TODO: This is not how JavaScript actually does it. Should eventually add support for strings
                }

                arr.elements[index.value] = right;
                env.assignVar(varName, arr);

                return evaluate(right, env);
            } else {
                const obj = found;
                const key = evaluate(memberExpr.index, env);
                if (key.kind !== "string") {
                    throw `Key should be string. Received ${key.kind}`;
                }
    
                const properties = obj.properties;
                const prop = properties.find(p => p.key.value === key.value);
                const index = prop
                    ? properties.indexOf(prop)
                    : properties.length;
    
                    
                properties[index] = ast.property({
                    key: ast.identifier(key.value),
                    value: right
                });
                
                env.assignVar(memberExpr.left.value, obj);
    
                return evaluate(right, env);
            }
        default:
            throw(`
                evalAssignmentExpression: Invalid left side of assignmentExpression: "${left.type}"
                Only supports identifiers for now...
            `);
    }
    
    

    // indent[0] = ast.Expression
    // ident['key'] = ast.Expression
    // ident.key = ast.Expression
    //const varName = evaluate(left, env);

    /*
    if (varName.kind !== "string") {
        throw `evalAssignmentExpression: varName must be a string. Received ${varName.kind}`;
    };
    */    
}

function evalIfExpression(ifExpr: ast.IfExpression, env: Environment) {
    const condition = evaluate(ifExpr.condition, env);

    if (isTruthy(condition)) {
        return evaluate(ifExpr.consequence, env);
    } else if (ifExpr.alternative) {
        return evaluate(ifExpr.alternative, env);
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
    if (fn.kind !== "functionExpression" && fn.kind !== "functionDeclaration") {
        throw `Expected a function to apply, you passed ${fn.kind}`;
    }

    const extendedEnv = extendFunctionEnv(fn, args);
    const evaluated = evaluate(fn.body, extendedEnv);

    return unwrapReturnValue(evaluated);
}

function extendFunctionEnv(
    fn: obj.FunctionExpr | obj.FunctionDec,
    args: obj.Object[]
) {
    const env = new Environment(fn.env);

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