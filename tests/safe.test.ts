import { describe, test, beforeEach, expect } from 'vitest';
import { createContext, IContext } from '../src/context';
import { createSolutionStack, ISolution } from '../src/evaluator/solution';
import { safeEvaluate, safeParse, safeTokenize, safeSolve } from '../src/safe';

let ctx: IContext;
let solution: ISolution;

beforeEach(() => {
    ctx = createContext({
        variables: { x: 1 },
        constants: { y: 2 },
        preferences: {
            angles: 'deg'
        }
    });
    solution = createSolutionStack();
});

describe('safe tokenization', () => {
    test('invoking safeTokenize does not throw errors', () => {
        safeTokenize(ctx, '2+x*');
    });

    test('tokenizing an invalid expression', () => {
        const res = safeTokenize(ctx, 'sin(45');
        expect(res).toHaveProperty('data', undefined);
    });

    test('tokenizing a valid expression', () => {
        const res = safeTokenize(ctx, '2+x');
        expect(res).toHaveProperty('error', undefined);
    });
});

describe('safe parsing', () => {
    test('invoking safeParse does not throw errors', () => {
        const tokens = safeTokenize(ctx, '2+sin(45)*5x').data!;
        safeParse(tokens);
    });

    test('parsing corrupted token stream', () => {
        const tokens = safeTokenize(ctx, '2+sin(45)*5x').data!;
        tokens.pop();
        tokens.pop();
        tokens.pop();
        const res = safeParse(tokens);
        expect(res).toHaveProperty('data', undefined);
    });

    test('parsing a valid token stream', () => {
        const tokens = safeTokenize(ctx, '2+sin(45)*5x').data!;
        const res = safeParse(tokens);
        expect(res).toHaveProperty('error', undefined);
    });
});

describe('safe evaluation', () => {
    test('invoking safeEvaluate does not throw errors', () => {
        const tokens = safeTokenize(ctx, '2+sin(45)*5x+y+z').data!;
        const tree = safeParse(tokens).data!;
        safeEvaluate(ctx, tree.body[0], solution);
    });

    test('evaluation with errors', () => {
        const tokens = safeTokenize(ctx, 'y = 2').data!;
        const tree = safeParse(tokens).data!;
        const res = safeEvaluate(ctx, tree.body[0], solution);
        expect(res).toHaveProperty('data', undefined);
    });

    test('evaluation without errors', () => {
        const tokens = safeTokenize(ctx, '2+sin(45)*5x').data!;
        const tree = safeParse(tokens).data!;
        const res = safeEvaluate(ctx, tree.body[0], solution);
        expect(res).toHaveProperty('error', undefined);
    });
});

describe('safe solve', () => {
    test('invoking safeSolve does not throw errors', () => {
        safeSolve(ctx, '2+');
    });

    test('evaluation with errors', () => {
        const res = safeSolve(ctx, '2+');
        expect(res).toHaveProperty('data', undefined);
    });

    test('evaluation without errors', () => {
        const res = safeSolve(ctx, '2+3');
        expect(res).toHaveProperty('error', undefined);
    });
});
