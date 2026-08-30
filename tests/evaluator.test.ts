import { describe, test, expect, beforeEach } from 'vitest';
import { tokenize } from '../src/lexer';
import { parse } from '../src/parser';
import { type IContext, createContext } from '../src/context';
import { evaluate, explain } from '../src/evaluator';

let ctx: IContext;

beforeEach(() => {
    ctx = createContext({
        variables: { x: 1 },
        constants: { y: 1 },
        preferences: {
            angles: 'deg'
        }
    });
});

describe('evaluator', () => {
    test('simple ast tree', () => {
        const expr = '1+2+x';
        const tokens = tokenize(ctx, expr);
        const ast = parse(tokens);
        expect(() => evaluate(ctx, ast.body[0])).not.toThrow();
        expect(evaluate(ctx, ast.body[0])).toBe(4);
    });

    test('complex ast tree', () => {
        const expr = `1 + add(x + 3, cos(60) + 0.25, 0.25)`;
        const tokens = tokenize(ctx, expr);
        const ast = parse(tokens);
        expect(() => evaluate(ctx, ast.body[0])).not.toThrow();
        expect(evaluate(ctx, ast.body[0])).toBe(6);
    });

    test('unknown variables', () => {
        const ast = parse(tokenize(ctx, 'nope + 1'));
        expect(() => evaluate(ctx, ast.body[0])).toThrow(
            /unknown variable 'nope'/
        );
    });
});

describe('solution generator', () => {
    test('step by step solution for simple expression', () => {
        const expr = `3pi - 1`;
        const tokens = tokenize(ctx, expr);
        const ast = parse(tokens);
        ctx.preferences.precision = 4;
        expect(explain(ctx, ast.body[0]).solution).toStrictEqual([
            '3 * 3.142 - 1',
            '9.426 - 1',
            '8.426'
        ]);
    });
});
