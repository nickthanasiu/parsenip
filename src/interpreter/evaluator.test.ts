import { Context } from "./context";
import { evaluate } from "./evaluator";
import * as obj from "./object";
import { Lexer } from "./lexer";
import { Parser } from "./parser";


test(`evaluator retrieves value of key from object literal`, () => {
  const evaluated = testEval(`
    const person = { name: "Nick" };
    person["name"];
  `);

  const expected = obj.string("Nick");  
  expect(evaluated).toEqual(expected);
});

test(`evaluator retrieves value from array literal using index`, () => {
  const evaluated = testEval(`
    const arr = ['a', 'b', 'c'];
    arr[0];
  `);

  const expected = obj.string('a');
  expect(evaluated).toEqual(expected);
});

test(`evaluator handles variable assignment using identifier (i.e., someIdent = someValue;)`, () => {

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

  return evaluate(program, new Context());
}