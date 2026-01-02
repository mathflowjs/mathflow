import { describe, test, expect, beforeEach } from 'vitest';
import { type IContextAPI, createContext } from '../src/context';

let ctx: IContextAPI;

const expr = '1 + 3sin(30)';

beforeEach(() => {
    ctx = createContext();
});

describe('latex output', () => {
    test('mode of output', () => {
        expect(ctx.renderAsLaTeX(expr, { mode: 'inline' })).toEqual(
            '$1+3 \\cdot \\text{sin}\\left(30\\right) \\\\ $'
        );
        expect(ctx.renderAsLaTeX(expr, { mode: 'display' })).toEqual(
            '$$1+3 \\cdot \\text{sin}\\left(30\\right) \\\\ $$'
        );
        expect(ctx.renderAsLaTeX(expr, { mode: 'align' })).toEqual(
            `\\begin{align}\n1+3 \\cdot \\text{sin}\\left(30\\right) \\\\\n\n\\end{align}`
        );
    });
});
