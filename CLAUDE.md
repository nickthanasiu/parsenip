# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

Parsenip is an interactive JavaScript interpreter and AST visualizer that runs in the browser. Source code flows through:

```
Source → Lexer → Tokens → Parser → AST → Evaluator → Result
```

The UI is a split-screen: a Monaco-based code editor on the left, and a tabbed results panel on the right showing either the token list or the AST.

## Commands

```bash
npm run dev       # Start Vite dev server at http://localhost:5000
npm run build     # tsc + Vite production build
npm run lint      # ESLint (zero warnings allowed)
npm run test      # Run Jest unit tests
npm run repl      # Start CLI REPL (uses tsx)
npm run repl <filename>  # Execute a file via the CLI
```

Run a single test file:
```bash
npx jest src/interpreter/lexer.test.ts
```

## Architecture

### Interpreter (`src/interpreter/`)

The core language engine — pure TypeScript with no UI dependencies.

- **`token.ts`** — `TokenType` enum, `Token` interface, `Position` type (`{ start, end }` as character offsets into the source string), and `lookupIdentifierType` for keyword detection.
- **`lexer.ts`** — `Lexer` class and `lex()` convenience function. Each token carries a `Position` with absolute character offsets used for editor highlighting.
- **`ast.ts`** — All AST node type definitions. Every node extends a base with `type`, `start`, and `end` (character offsets).
- **`parser.ts`** — Pratt (top-down operator precedence) parser. Uses `prefixParseFns` and `infixParseFns` maps keyed by `TokenType`. Supports `testMode` flag to suppress errors in tests.
- **`evaluator.ts`** — Tree-walking evaluator. Dispatches on `node.type` via a switch statement.
- **`object.ts`** — Runtime value types returned by the evaluator.
- **`environment.ts`** — Lexical scoping for variable bindings.

### UI (`src/`)

- **`App.tsx`** — Root component. Calls `lex(input)` directly for the token panel; passes `input` to `ParserPanel` for parsing and AST display. Manages code highlighting via `highlightCode(start, end)` from `useEditor`.
- **`features/textEditor/useEditor.tsx`** — Monaco editor integration. Tracks cursor position as an absolute character offset (via `getOffsetAt`). Exposes `highlightCode(start, end)` which converts offsets back to line/column for Monaco decorations. Persists editor content to `localStorage`.
- **`features/resultsPanel/ResultsPanel.tsx`** — Tabbed panel container with "tokens" and "parser" tabs (defaults to "parser").
- **`features/resultsPanel/TokenCard.tsx`** — Renders a single token with type and position.
- **`features/resultsPanel/ParserPanel.tsx`** — Parses input and renders the root `ASTNode`.
- **`features/resultsPanel/ASTNode.tsx`** — Recursive component that renders any AST node. Auto-expands when the cursor is over the node's range, and supports manual expand/collapse. Highlights the editor range on hover.
- **`components/Expander.tsx`** — Collapsible container used by `ASTNode`.

### Key Data Flow

1. User types in Monaco editor → `useEditor` captures input and cursor position (as absolute offsets).
2. `App.tsx` calls `lex(input)` → renders `TokenCard` list.
3. `App.tsx` passes `input` to `ParserPanel` → `Parser` builds AST → `ASTNode` renders recursively.
4. Hovering a `TokenCard` or `ASTNode` calls `highlightCode(start, end)` → Monaco applies a `highlighted-code` inline decoration.
5. `cursorPosition` (absolute offset) flows into every `ASTNode`; nodes auto-expand when cursor is within their `start`–`end` range.

### Tests

Tests live alongside interpreter source files (`*.test.ts`). They use Jest + `ts-jest`. The `Parser` accepts `testMode: true` to suppress console errors.
