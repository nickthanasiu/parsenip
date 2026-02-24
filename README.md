# Parsenip

An interactive JavaScript interpreter and AST visualizer that runs in the browser.

## About

Parsenip lets you write JavaScript code and watch in real time as it is tokenized, parsed into an Abstract Syntax Tree, and evaluated. It started as an implementation of the Monkey language from *Writing an Interpreter in Go* by Thorsten Ball, and has since been extended toward full JavaScript support.

The goal is to make the inner workings of an interpreter visible and explorable — useful for anyone learning how programming languages are implemented.

## How It Works

Source code flows through three stages:

```
Source → Lexer → Tokens → Parser → AST → Evaluator → Result
```

The UI is split into two panels:

- **Left** — a Monaco-based code editor where you write JavaScript
- **Right** — a tabbed results panel with two views:
  - **Tokens** — every token the lexer produced, with its type and position
  - **Parser** — the full AST as an interactive, expandable tree

Hovering over a token or AST node highlights the corresponding source code in the editor.

## Supported Language Features

### Implemented

- Variable declarations: `let`, `const`
- Functions: declarations and expressions, closures
- Control flow: `if` / `else`
- Operators: arithmetic (`+`, `-`, `*`, `/`), comparison (`==`, `!=`, `<`, `>`, `<=`, `>=`), logical (`&&`, `||`, `!`)
- Data types: integers, booleans, strings, `null`, `undefined`
- Collections: object literals, array literals
- Member access: dot notation (`obj.prop`) and bracket notation (`obj["key"]`, `arr[0]`)
- Assignment: variable reassignment, object/array property assignment
- Comments: single-line (`//`) and multi-line (`/* */`)

### Not Yet Implemented

- Loops: `for`, `while`, `do...while`
- Arrow functions
- Template literals
- Compound assignment: `+=`, `-=`, `*=`, `/=`
- Destructuring and spread/rest
- Classes and prototypes
- `async` / `await` and Promises
- `try` / `catch` error handling
- Built-in methods and standard library

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

## Usage

**Browser** — write code in the editor and see the token list and AST update as you type.

**CLI REPL** — run an interactive prompt in your terminal:

```bash
npm run repl
```

**Execute a file:**

```bash
npm run repl <filename>
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Compile TypeScript and build for production |
| `npm run preview` | Preview the production build |
| `npm run test` | Run Jest unit tests |
| `npm run lint` | Run ESLint |
| `npm run repl` | Start the CLI REPL |

## Project Structure

```
src/
├── interpreter/        # Core language engine
│   ├── lexer.ts        # Tokenization
│   ├── parser.ts       # AST generation (Pratt parser)
│   ├── evaluator.ts    # Tree-walking evaluator
│   ├── ast.ts          # AST node definitions
│   ├── token.ts        # Token types
│   ├── object.ts       # Runtime value types
│   └── environment.ts  # Variable scoping
├── features/
│   ├── textEditor/     # Monaco editor integration
│   └── resultsPanel/   # Token and AST visualization
├── components/         # Shared UI components
└── repl/               # CLI REPL
```
