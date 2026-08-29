import { type IContext } from './context';
import { explain, type IResult } from './evaluator';
import { parse } from './parser';
import { tokenize } from './lexer';

export { type IResult };

/**
 * evaluate a one-line expression
 */
export function solve(ctx: IContext, code: string): IResult {
    return solveBatch(ctx, code)[0] || { value: 0, solution: [] };
}

/**
 * evaluate a multiple-line expression
 */
export function solveBatch(ctx: IContext, code: string): IResult[] {
    const tokens = tokenize(ctx, code);
    const ast = parse(tokens);
    return ast.body.map((node) => explain(ctx, node));
}
