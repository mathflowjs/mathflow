import { describe, test, expect } from 'vitest';
import {
    createContext,
    createSolutionStack,
    evaluate,
    parse,
    renderTokensAsHTML,
    safeEvaluate,
    safeParse,
    safeSolve,
    safeSolveBatch,
    safeTokenize,
    tokenize
} from '../src';

// the public API as released from master; it must keep working unchanged
describe('v2 api', () => {
    const ctx = createContext();

    test('evaluate records steps into a solution stack', () => {
        const solution = createSolutionStack();
        const [node] = parse(tokenize(ctx, '2 * (3 + 4)')).body;

        expect(evaluate(ctx, node, solution)).toBe(14);
        expect(solution.steps).toStrictEqual(['2 * (3 + 4)', '2 * 7', '14']);
        expect(solution.id).toBe(3);
    });

    test('safe wrappers return { data, error }', () => {
        expect(safeTokenize(ctx, 'sin(45').error?.type).toBe('LexicalError');

        const tokens = safeTokenize(ctx, '1 + 2').data!;
        const tree = safeParse(tokens).data!;
        const solution = createSolutionStack();

        expect(safeEvaluate(ctx, tree.body[0], solution).data).toBe(3);
        expect(safeSolve(ctx, '2+').error).toBeDefined();
        expect(
            safeSolveBatch(ctx, '1 + 1\n2 + 2').data?.map((r) => r.value)
        ).toStrictEqual([2, 4]);
    });

    test('classPrefix renames every class and custom property', () => {
        const tokens = tokenize(ctx, '2x + 1');
        const { html, css } = renderTokensAsHTML(tokens, {
            classPrefix: 'calc',
            colorScheme: 'dark'
        });

        expect(html).toContain('class="calc-expression calc-dark"');
        expect(html).toContain('calc-token calc-number');
        expect(css).toContain('--calc-bg');
        expect(html + css).not.toContain('mf-');

        expect(renderTokensAsHTML(tokens).html).toContain('mf-expression');
    });
});
