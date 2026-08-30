# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Mathflow is a dependency-free TypeScript library that evaluates math expressions written in natural notation (`2x + 3(y - 1)`), and renders them as HTML or LaTeX. Published as `@mathflowjs/mathflow`.

## Commands

```sh
pnpm dev                              # Vite demo (index.html + demo/main.ts)
pnpm test                             # vitest run
pnpm exec vitest run tests/lexer.test.ts   # single file
pnpm exec vitest run -t 'implicit'    # single test by name
pnpm lint                             # eslint src tests + prettier --check
pnpm lint:fix                         # eslint --fix + prettier --write
pnpm build                            # unbuild -> dist/ (ESM + CJS + .d.ts)
```

`tsc --noEmit` currently fails on vitest's own type declarations (`moduleResolution: "node"` vs `vite/module-runner`) — pre-existing, not caused by your changes. Type errors in `src/` surface through `pnpm build` and the editor instead.

Contribution conventions (style, commit format, PR expectations) live in `AGENTS.md`.

## Architecture

Pipeline, orchestrated by `src/solve.ts`:

```
code ──tokenize(ctx, code)──> IToken[] ──parse(tokens)──> AST ──explain(ctx, node)──> { value, solution }
                                  └── renderTokensAsHTML / renderTokensAsLaTeX
```

`createContext()` (`src/context.ts`) is the single entry point for consumers: it holds `variables`, `constants`, `functions`, and `preferences` (`precision`, `fractionDigits`, `angles`), and exposes `solve` / `solveBatch` / `renderAsHTML` / `renderAsLaTeX` bound to that context. Every stage takes `ctx` explicitly — there is no global state.

Things that are non-obvious from any single file:

- **The lexer is context-dependent.** `tokenize` classifies an identifier as `TOKEN.FUNCTION` only if `ctx.functions.has(name)`. Custom functions must be registered on the context *before* the expression is tokenized, otherwise they lex as plain identifiers — and since `name(` then becomes implicit multiplication, a missing registration surfaces as a *syntax* error, not a missing-function one. This is why `tests/functions.test.ts` exercises every builtin through `ctx.solve()`.
- **Implicit multiplication is a lexer concern, not a parser one.** `expandImplicitMultiplication` splices a synthetic `*` token (marked `implicit: true`) between e.g. `)(`, `2x`, `2sin`. The parser sees fully explicit token streams. Add new implicit-product cases there, not in `parseFactor`.
- **Renderers consume tokens, not the AST.** `src/render/html.ts` and `src/render/latex.ts` walk `IToken[]`, so they preserve source order and must decide themselves what to do with `implicit` tokens. Rendering never evaluates.
- **Solutions come from reducing the tree, not from logging strings.** `run` in `src/evaluator/index.ts` first calls `resolve` (names → values, and where an unknown variable throws), then loops `reduceOnce` to a fixpoint. Each `reduceOnce` collapses *every* sub-expression whose operands are already literals, so one call is one step. `evaluate` runs the loop for the value; `explain` runs the same loop and renders each intermediate tree with `stringify` (`src/evaluator/solution.ts`). Anything that produces a step must go through a node type the reducer handles — that uniformity is the point, an earlier design instrumented node types individually and silently dropped multi-argument calls and unary expressions.
- **A unary over a literal is folded, not reduced.** `-3` is notation for a negative number, so `signed()` collapses it during `resolve` rather than spending a step on it. Without that, `-(3+4)` emits `-7` twice.
- **`stringify` derives parentheses from precedence**, including that `^` is right-associative and that a negative literal needs wrapping as a right operand (`2 - (-3)`). Steps are valid mathflow source and round-trip through `tokenize` — the demo and `renderAsHTML` rely on that.
- **Precision is applied per node, not once at the end.** `toNumber` runs `toPrecision`/`toFixed` on every literal and intermediate result, so each printed step's arithmetic checks out on its own. That is also why `1/3*3` is `0.9999` at `fractionDigits: 4`. Changing where it's called changes rounding across the whole suite.
- **Errors are plain objects, not `Error` instances.** `createError` (`src/error/index.ts`) returns `{ name, type, message, suggestion }` with `type` from the `ERRORS` enum. Never use `instanceof Error` on them. `safe(() => ...)` (also `src/error/index.ts`) turns any throwing API into `ISafeResult` (`{ data, error }`) — there is one wrapper for everything, so a new throwing API needs no counterpart.
- **`src/index.ts` is the public surface.** Anything not re-exported there is internal, regardless of visibility. Built-ins are registered in `src/functions/index.ts`, one `initX()` per domain module; trig functions close over `ctx.preferences` to honour `angles: 'rad' | 'deg'` (only true angles are converted — an inverse function takes a ratio, a hyperbolic one a plain real).
- **Every value is a `number`, deliberately.** No arrays, matrices, complex numbers or fractions; list-shaped functions are variadic (`mean(1, 2, 3)`), and predicates return `1`/`0`. `TODO.md` records what this rules out and why — check it before adding a function that wants a new value type.

`dist/` is build output — never edit it. Releases go through `release-it` (conventional-changelog, `master` only, manual `workflow_dispatch` in CI).
