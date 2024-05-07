import { Environment } from "./environment";
import { evaluate } from "./evaluator";
import * as obj from "./object";
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
    `const x = { foo: "bar" };`,
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

    /*
    obj.objectLiteral([
      ast.property(
        ast.identifier("foo", { start: 0, end: 0 }),
        ast.stringLiteral({ value: "bar", start: 0, end: 0 })
      )
    ]),
    */
  ];

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

/*
test(`Handle object['key'] = val assignment`, () => {
  const testCases = [
    `
      const person = {};
      person["name"] = "Nick";
    `,
    `
      const person = {};
      person["name"] = "Nick";
      person["name"];
    `,
];

  const evaluated = testCases.map(testEval);
  const expected = [
    obj.string("Nick"),
    obj.string("Nick"),
  ];

  expect(evaluated).toEqual(expected);
});

*/


function testEval(input: string): obj.Object {
  const l = new Lexer(input);
  const p = new Parser(l);
  if (p.errors.length !== 0) {
    p.errors.forEach(console.error);
  }

  const program = p.parseProgram();
  if (!program) {
    throw new Error(`Could not parse: ${input}`);
  }

  return evaluate(program, new Environment());
}