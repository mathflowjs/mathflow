import { describe, test, beforeEach, expect } from 'vitest';
import { createContext, IContext } from '../src/context';
import { createSolutionStack } from '../src/evaluator/solution';
import { safeEvaluate, safeParse, safeSolve, safeTokenize } from '../src/safe';

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

describe('safe wrappers', () => {
    test('does not throw on invalid input', () => {
        expect(() => safeTokenize(ctx, 'sin(45')).not.toThrow();
        expect(() => safeSolve(ctx, '2+')).not.toThrow();
    });

    test('reports a lexical error', () => {
        const res = safeTokenize(ctx, 'sin(45');
        expect(res).toHaveProperty('data', undefined);
        expect(res.error?.type).toBe('LexicalError');
    });

    test('reports a syntax error', () => {
        const tokens = safeTokenize(ctx, '2+sin(45)*5x').data!;
        tokens.pop();
        tokens.pop();
        tokens.pop();

        const res = safeParse(tokens);
        expect(res).toHaveProperty('data', undefined);
        expect(res.error?.type).toBe('SyntaxError');
    });

    test('reports a runtime error', () => {
        const tokens = safeTokenize(ctx, 'y = 2').data!;
        const tree = safeParse(tokens).data!;
        const res = safeEvaluate(ctx, tree.body[0], createSolutionStack());

        expect(res).toHaveProperty('data', undefined);
        expect(res.error?.type).toBe('RuntimeError');
    });

    test('passes the value through when nothing throws', () => {
        const res = safeSolve(ctx, '2+3');

        expect(res).toHaveProperty('error', undefined);
        expect(res.data).toMatchObject({ value: 5 });
    });
});
