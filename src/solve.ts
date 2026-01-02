import { IContext } from './context';
import { evaluate } from './evaluator';
import { parse } from './parser';
import { tokenize } from './lexer';
import { createSolutionStack } from './evaluator/solution';

export type IResult = {
    value: number;
    solution: string[];
};

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
    const result = ast.body.map((node) => {
        const solution = createSolutionStack();
        const value = evaluate(ctx, node, solution);
        return { value, solution: solution.steps };
    });
    return result;
}
