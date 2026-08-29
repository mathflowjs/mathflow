import { type IContext } from './context';
import { safeExecutor } from './error';
import { evaluate, explain } from './evaluator';
import { tokenize } from './lexer';
import { type IToken } from './lexer/tokens';
import { type INode, parse } from './parser';
import { solve, solveBatch } from './solve';

export { type ISafeResult } from './error';

/**
 * Safely tokenize without throwing an error
 */
export function safeTokenize(ctx: IContext, code: string) {
    return safeExecutor(() => tokenize(ctx, code));
}

/**
 * Safely parse without throwing an error
 */
export function safeParse(tokens: IToken[]) {
    return safeExecutor(() => parse(tokens));
}

/**
 * Safely evaluate without throwing an error
 */
export function safeEvaluate(ctx: IContext, node: INode) {
    return safeExecutor(() => evaluate(ctx, node));
}

/**
 * Safely evaluate with a step-by-step solution, without throwing an error
 */
export function safeExplain(ctx: IContext, node: INode) {
    return safeExecutor(() => explain(ctx, node));
}

/**
 * Safely solve without throwing an error
 */
export function safeSolve(ctx: IContext, code: string) {
    return safeExecutor(() => solve(ctx, code));
}

/**
 * Safely solve a batch without throwing an error
 */
export function safeSolveBatch(ctx: IContext, code: string) {
    return safeExecutor(() => solveBatch(ctx, code));
}
