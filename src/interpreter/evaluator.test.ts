import { Environment } from "./environment";
import { evaluate } from "./evaluator";
import * as obj from "./object";
import * as ast from "./ast";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

test(`variable declarations`, () => {
  const testCases = [
    `let x;`,
    `let x = "";`,
    `const x = "";`,
    `const x = "abc";`,
    `let x = "abc";`,
    `const x = 123;`,
    `let x = 123;`,
    //`const x = null;`,    @TODO: Handle null as a keyword
    //`let x = null;`,
    //`const x = undefined; `,
    //`let x = undefined;`, @TODO: Handle undefined as a keyword
    `const x = true;`,
    `let x = false;`,
  ];
    
  const actual = testCases.map(testEval);
  const expected = [
    obj.UNDEFINED,
    obj.string(""),
    obj.string(""),
    obj.string("abc"),
    obj.string("abc"),
    obj.integer(123),
    obj.integer(123),
    //obj.NULL,
    //obj.NULL,
    //obj.UNDEFINED,
    //obj.UNDEFINED,
    obj.boolean(true),
    obj.boolean(false),
  ];

  expect(actual).toEqual(expected);
});


test('variable declaration of object literal', () => {
  const testCase = `const x = { foo: "bar" };`
  const actual = testEval(testCase);

  const expected = obj.objectLiteral([
    ast.property({
      key: ast.identifier("foo"),
      value: ast.stringLiteral("bar")
    })
  ]);

  expect(actual).toEqual(expected);
});



test(`retrieve value of key from object literal`, () => {
  const evaluated = testEval(`
    const person = { name: "Nick" };
    person["name"];
  `);

  const expected = obj.string("Nick");  
  expect(evaluated).toEqual(expected);
});

test(`retrieve value from array literal using index`, () => {
  const evaluated = testEval(`
    const arr = ['a', 'b', 'c'];
    arr[0];
  `);

  const expected = obj.string('a');
  expect(evaluated).toEqual(expected);
});

test(`handle variable assignment using identifier (i.e., someIdent = someValue;)`, () => {

  const cases = [
    `let foo; foo = "bar"; foo;`,
    `let foo = "baz"; foo = "bar"; foo;`,
    `
      let foo = "original";

      function update() {
        foo = "updated";
      }

      update();
      foo;
    `,
    `
      let foo = "original";

      function someFunc() {
        let foo = "something else";
        return foo;
      }

      someFunc();
      foo;
    `
  ];

  const evaluated = cases.map(testEval);

  const expected = [
    obj.string("bar"),
    obj.string("bar"),
    obj.string("updated"),
    obj.string("original"),
  ];

  expect(evaluated).toEqual(expected);
});


test(`Handle object['key'] = val assignment`, () => {
  const testCases = [
    `
      const person = { name: "Steve" };
      person["age"] = 50;
    `,
    `
      const person = { name: "Steve" };
      person["age"] = 50;
      person["age"];
    `,
    `
      const person = { name: "Steve" };
      person["name"] = "Mark";
      person["name"];
    `
];

  const evaluated = testCases.map(testEval);
  const expected = [
    obj.integer(50),
    obj.integer(50),
    obj.string("Mark")
  ];

  expect(evaluated).toEqual(expected);
});

test(`Handle array[index] = val assignment`, () => {
  const testCases = [
    `
      const letters = [];
      letters[0] = "A";
    `,
    `
      const letters = [];
      letters[0] = "A";
      letters[0];
    `
];

  const evaluated = testCases.map(testEval);
  const expected = [
    obj.string("A"),
    obj.string("A"),
  ];

  expect(evaluated).toEqual(expected);
});


function testEval(input: string): obj.Object {
  const p = new Parser({
    lexer: new Lexer(input),
    testMode: true
  });

  if (p.errors.length !== 0) {
    p.errors.forEach(console.error);
  }

  const program = p.parseProgram();
  if (!program) {
    throw new Error(`Could not parse: ${input}`);
  }

  return evaluate(program, new Environment());
}