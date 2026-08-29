import { describe, test, beforeEach, expect } from 'vitest';
import { createContext, IContext } from '../src/context';
import { safe } from '../src/error';
import { evaluate } from '../src/evaluator';
import { tokenize } from '../src/lexer';
import { parse } from '../src/parser';
import { solve } from '../src/solve';

let ctx: IContext;

beforeEach(() => {
    ctx = createContext({
        variables: { x: 1 },
        constants: { y: 2 },
        preferences: {
            angles: 'deg'
        }
    });
});

describe('safe', () => {
    test('does not throw on invalid input', () => {
        expect(() => safe(() => tokenize(ctx, 'sin(45'))).not.toThrow();
        expect(() => safe(() => solve(ctx, '2+'))).not.toThrow();
    });

    test('reports a lexical error', () => {
        const res = safe(() => tokenize(ctx, 'sin(45'));
        expect(res).toHaveProperty('data', undefined);
        expect(res.error?.type).toBe('LexicalError');
    });

    test('reports a syntax error', () => {
        const tokens = safe(() => tokenize(ctx, '2+sin(45)*5x')).data!;
        tokens.pop();
        tokens.pop();
        tokens.pop();

        const res = safe(() => parse(tokens));
        expect(res).toHaveProperty('data', undefined);
        expect(res.error?.type).toBe('SyntaxError');
    });

    test('reports a runtime error', () => {
        const tree = safe(() => parse(tokenize(ctx, 'y = 2'))).data!;
        const res = safe(() => evaluate(ctx, tree.body[0]));

        expect(res).toHaveProperty('data', undefined);
        expect(res.error?.type).toBe('RuntimeError');
    });

    test('passes the value through when nothing throws', () => {
        const res = safe(() => solve(ctx, '2+3'));

        expect(res).toHaveProperty('error', undefined);
        expect(res.data).toMatchObject({ value: 5 });
    });
});
