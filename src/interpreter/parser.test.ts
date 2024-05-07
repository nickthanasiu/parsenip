import * as ast from "./ast";
import { parse } from "./parser";


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

    const actual = testParse(input);

    expect(actual).toEqual(expected);
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

    const actual = testParse(input);
    expect(actual).toEqual(expected);
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

    const actual = testParse(input);

    expect(actual).toStrictEqual(expected);
});

test('Parse integer literals', () => {
    const expected = ast.program([
        ast.expressionStatement(ast.integerLiteral(5))
    ]);

    const input = "5";
    const actual = testParse(input);

    expect(actual).toStrictEqual(expected);
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
    
    const actual = inputs.map(testParse);
    
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
        return testParse(`5 ${operator} 5;`);
    });

    expect(actual).toStrictEqual(expected);
});

test('Parse objectLiteral memberExpression assignment', () => {
    const input = `
        const user = { name: 'Steve' };
        user["email"] = "steve@email.com";
    `;



    const actual = testParse(input);

    const expected = ast.program([
        ast.variableDeclaration({
            constant: true,
            identifier: ast.identifier("user"),
            value: ast.objectLiteral([
                ast.property({
                    key: ast.identifier("name"),
                    value: ast.stringLiteral("Steve")
                })
            ])
        }),
        ast.expressionStatement(
            ast.assignmentExpression({
                left: ast.memberExpression({
                    left: ast.identifier("user"),
                    index: ast.stringLiteral("email")
                }),
                operator: "=",
                right: ast.stringLiteral("steve@email.com")
            })
        )
        
    ]);

    expect(actual).toEqual(expected);
});


function testParse(input: string): ast.Program {
    const [program, _] = parse(input, { throwOnError: true, testMode: true });

    if (!program) {
      throw new Error(`Could not parse: ${input}`);
    }
  
    return program;
  }

