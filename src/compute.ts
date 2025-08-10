import { Context } from './context';
import { evaluate } from './evaluator';
import { parse } from './parser';
import { tokenize } from './lexer';
import { createSolutionStack, Solution } from './evaluator/solution';

export type ComputeResult = {
    value: number;
    solution: Solution;
};

/**
 * evaluate a one-line  expression
 */
export function compute(ctx: Context, code: string): ComputeResult {
    return computeBatch(ctx, code)[0] || { value: 0 };
}

/**
 * evaluate a multi-line expression
 */
export function computeBatch(ctx: Context, code: string): ComputeResult[] {
    const tokens = tokenize(ctx, code);
    const ast = parse(tokens);
    const result = ast.body.map((node) => {
        const solution = createSolutionStack();
        const value = evaluate(ctx, node, solution);
        return { value, solution };
    });
    return result;
}
