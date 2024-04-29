import readline from "readline";
import fs from "fs";
import { parse } from "../interpreter/parser";
import { evaluate } from "../interpreter/evaluator";
import * as obj from "../interpreter/object";
import { Context } from "../interpreter/context";

start();

async function start() {
    const args = process.argv.slice(2);

    if (args.length > 1) {
        console.error("Too many arguments");
        return;
    }

    if (args.length === 1) {
        const filename = args[0];
        console.log('FILENAME ', filename);
        await evalFile(filename);
        return;
    }

    repl();
}

function repl() {
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

async function evalFile(filename: string) {

    fs.readFile(filename, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const ctx = new Context();
        const code = data.toString();
        const [program, _] = parse(code);
        const evaluated = evaluate(program, ctx);
        if (evaluated) {
            console.log(obj.toString(evaluated));
        }
    });
}