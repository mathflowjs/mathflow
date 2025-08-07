import { Context } from "./context";
import { evaluate } from "./evaluator";
import { parse } from "./parser";
import { tokenize } from "./lexer";
import { createSolutionStack, Solution } from "./evaluator/solution";


export type ComputeResult = {
    value: number;
    solution: Solution;
}

export function compute(ctx: Context, code: string): ComputeResult[] {
    const tokens = tokenize(ctx, code);
    const ast = parse(tokens);
    const result = ast.body.map((node) => {
        const solution = createSolutionStack()
        const value = evaluate(ctx, node, solution)
        return { value, solution }
    });
    return result
}

