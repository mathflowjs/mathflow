import { type IContext } from './context';
import { safe } from './error';
import { evaluate } from './evaluator';
import { type ISolution } from './evaluator/solution';
import { tokenize } from './lexer';
import { type IToken } from './lexer/tokens';
import { type INode, parse } from './parser';
import { solve, solveBatch } from './solve';

export { type ISafeResult } from './error';

/**
 * Safely tokenize without throwing an error
 */
export function safeTokenize(ctx: IContext, code: string) {
    return safe(() => tokenize(ctx, code));
}

/**
 * Safely parse without throwing an error
 */
export function safeParse(tokens: IToken[]) {
    return safe(() => parse(tokens));
}

/**
 * Safely evaluate without throwing an error
 */
export function safeEvaluate(ctx: IContext, node: INode, solution?: ISolution) {
    return safe(() => evaluate(ctx, node, solution));
}

/**
 * Safely solve without throwing an error
 */
export function safeSolve(ctx: IContext, code: string) {
    return safe(() => solve(ctx, code));
}

/**
 * Safely solve a batch without throwing an error
 */
export function safeSolveBatch(ctx: IContext, code: string) {
    return safe(() => solveBatch(ctx, code));
}
