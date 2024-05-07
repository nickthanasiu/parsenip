import * as ast from "./ast";
import { parse } from "./parser";


function ignorePosition(a: ast.Node) {
    if (typeof a === "object") {
        // Array
        if (Array.isArray(a)) {
            a.every(el => ignorePosition(el));
        }

        // Object
        for (const val of Object.values(a)) {
            ignorePosition(val);
        }
    }


    if (a && a.start != undefined && a.end != undefined) {
        a.start = a.end = -1;
    }
}

test('Parse let statements', () => {

    const input = `
        let myVar;
        let x = 5;
        let y = 10;

        let foobar = 838383;
    `;

    const expected = ast.program([
        ast.variableDeclaration({ constant: false, identifier: ast.identifier("myVar")}),
        ast.variableDeclaration({ constant: false, identifier: ast.identifier("x"), value: ast.integerLiteral(5) }),
        ast.variableDeclaration({ constant: false, identifier: ast.identifier("y"), value: ast.integerLiteral(10) }),
        ast.variableDeclaration({ constant: false, identifier: ast.identifier("foobar"), value: ast.integerLiteral(838383) }),
    ]);

    const [actual, _] = parse(input, { throwOnError: true });

    expect(ignorePosition(actual)).toEqual(ignorePosition(expected));
});


test('Parse const statements', () => {
    const input  = `
        const myVar = 100;
        let foo;
    `;

    const expected = ast.program([
        ast.variableDeclaration({ constant: true, identifier: ast.identifier("myVar"), value: ast.integerLiteral(100) }),
        ast.variableDeclaration({ constant: false, identifier: ast.identifier("foo") }),
    ]);

    const [actual, _] = parse(input, { throwOnError: true });

    expect(ignorePosition(actual)).toEqual(ignorePosition(expected));
});


test('Parse return statements', () => {
    
    const input = `
        return 5;
        return 10;
        return 993322;
        return true;
        return false;
    `;

    const expected = ast.program([
        ast.returnStatement(ast.integerLiteral(5)),
        ast.returnStatement(ast.integerLiteral(10)),
        ast.returnStatement(ast.integerLiteral(993322)),
        ast.returnStatement(ast.booleanLiteral(true)),
        ast.returnStatement(ast.booleanLiteral(false)),
    ]);

    const [actual, _] = parse(input, { throwOnError: true });

    expect(ignorePosition(actual)).toStrictEqual(ignorePosition(expected));
});

test('Parse integer literals', () => {
    const expected = ast.program([
        ast.expressionStatement(ast.integerLiteral(5))
    ]);

    const input = "5";
    const [actual, _] = parse(input, { throwOnError: true });

    expect(ignorePosition(actual)).toStrictEqual(ignorePosition(expected));
});



test('Parse prefix expressions', () => {
    
    const expected = [
        // !5;
        ast.program([
            ast.expressionStatement(
                ast.prefixExpression({ operator: "!", right: ast.integerLiteral(5)})
            ),
        ]),
        // -15
        ast.program([
            ast.expressionStatement(
                ast.prefixExpression({ operator: "-", right: ast.integerLiteral(15) })
            )
        ]),
        // !true
        ast.program([
            ast.expressionStatement(
                ast.prefixExpression({ operator: "!", right: ast.booleanLiteral(true) })
            )
        ]),
        // !false
        ast.program([
            ast.expressionStatement(
                ast.prefixExpression({ operator: "!", right: ast.booleanLiteral(false) })
            )
        ]),
    ];

    
    const inputs = [
        "!5;",
        "-15;",
        "!true;",
        "!false;",
    ];
    
    const actual = inputs.map(input => {
        const [program, _] = parse(input, { throwOnError: true });
        return program;
    });

    expected.forEach(ignorePosition);
    actual.forEach(ignorePosition);
    
    expect(actual).toStrictEqual(expected);
});


test('Parse infix expressions', () => {
    const operators = ["+", "-", "*", "/", ">", "<", "==", "!="];

    const expected = operators.map(operator => {
        return ast.program([
            ast.expressionStatement(
                ast.infixExpression({
                    left: ast.integerLiteral(5),
                    operator,
                    right: ast.integerLiteral(5),
                })
            )
        ]);
    })

    const actual = operators.map(operator => {
        const [program, _] = parse(`5 ${operator} 5;`, { throwOnError: true });
        return program;
    });

    expected.forEach(ignorePosition);
    actual.forEach(ignorePosition);

    expect(actual).toStrictEqual(expected);
});