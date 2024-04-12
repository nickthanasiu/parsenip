import readline from "readline";
import { parse } from "../interpreter/parser";
import { evaluate } from "../interpreter/evaluator";
import * as obj from "../interpreter/object";
import { Context } from "../interpreter/context";

start();

function start() {
    const ctx = new Context();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "> ",
    });

    rl.prompt();

    rl.on('line', input => {
        const [program, _] = parse(input);

        const evaluated = evaluate(program, ctx);
        if (evaluated) {
            console.log(obj.toString(evaluated));
        }

        rl.prompt();
    });
}