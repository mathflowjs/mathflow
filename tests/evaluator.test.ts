import { describe, test, expect, beforeEach } from 'vitest';
import { tokenize } from '../src/lexer';
import { parse } from '../src/parser';
import { Context, createContext } from '../src/context';
import { evaluate } from '../src/evaluator';
import { createSolutionStack, Solution } from '../src/evaluator/solution';

let ctx: Context;
let solution: Solution;

beforeEach(() => {
    ctx = createContext({
        variables: { x: 1 },
        preferences: {
            angles: 'deg'
        }
    });
    solution = createSolutionStack();
});

describe('evaluator', () => {
    test('simple ast tree', () => {
        const expr = '1+2+x';
        const tokens = tokenize(ctx, expr);
        const ast = parse(tokens);
        expect(() => evaluate(ctx, ast.body[0], solution)).not.toThrow();
        expect(evaluate(ctx, ast.body[0], solution)).toBe(4);
    });

    test('complex ast tree', () => {
        const expr = `1 + add(x + 3, cos(60) + 0.25, 0.25)`;
        const tokens = tokenize(ctx, expr);
        const ast = parse(tokens);
        expect(() => evaluate(ctx, ast.body[0], solution)).not.toThrow();
        expect(evaluate(ctx, ast.body[0], solution)).toBe(6);
    });
});

describe('solution generator', () => {
    test('step by step solution for simple expression', () => {
        const expr = `3pi - 1`;
        const tokens = tokenize(ctx, expr);
        const ast = parse(tokens);
        ctx.preferences.precision = 4;
        evaluate(ctx, ast.body[0], solution);
        expect(solution.steps).toStrictEqual([
            '(3 * 3.142) - 1',
            '9.426 - 1',
            '8.426'
        ]);
    });
});
