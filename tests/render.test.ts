import { describe, test, expect, beforeEach } from 'vitest';
import { type IContextAPI, createContext } from '../src/context';

let ctx: IContextAPI;

const expr = '1 + 3sin(30)';

beforeEach(() => {
    ctx = createContext();
});

describe('latex output', () => {
    test('superscripts are braced as one group', () => {
        // `2^\\left(5-1\\right)` is a parse error, not just ugly output
        expect(ctx.renderAsLaTeX('2^(5-1)')).toContain('2^{5-1}');
        expect(ctx.renderAsLaTeX('2^3')).toContain('2^{3}');
        expect(ctx.renderAsLaTeX('2^-1')).toContain('2^{-1}');
        expect(ctx.renderAsLaTeX('2^sin(30)')).toContain(
            '2^{\\text{sin}\\left(30\\right)}'
        );
        // right-associative, so the nesting has to follow
        expect(ctx.renderAsLaTeX('2^3^2')).toContain('2^{3^{2}}');
    });

    test('a fraction only forms from a lone value', () => {
        expect(ctx.renderAsLaTeX('3/4')).toContain('\\frac{3}{4}');
        expect(ctx.renderAsLaTeX('2 * 3 / 4')).toContain('\\frac{3}{4}');
        // the numerator here is an exponent, not the bare `2`
        expect(ctx.renderAsLaTeX('y^2 / 6')).toContain('y^{2} \\div 6');
    });

    test('delimiter-pair functions', () => {
        expect(ctx.renderAsLaTeX('sqrt(25)')).toContain('\\sqrt{25}');
        expect(ctx.renderAsLaTeX('abs(-10)')).toContain('\\left|-10\\right|');
        expect(ctx.renderAsLaTeX('sqrt(x^2 + y^2)')).toContain(
            '\\sqrt{x^{2}+y^{2}}'
        );
        expect(ctx.renderAsLaTeX('ceil(-3.1)')).toContain(
            '\\left\\lceil -3.1\\right\\rceil'
        );
        expect(ctx.renderAsLaTeX('floor(2.7)')).toContain(
            '\\left\\lfloor 2.7\\right\\rfloor'
        );
    });

    test('groups render through the same rules as the top level', () => {
        // a nested call used to leak its opening delimiter and never close it
        expect(ctx.renderAsLaTeX('sqrt(abs(-16))')).toContain(
            '\\sqrt{\\left|-16\\right|}'
        );
        expect(ctx.renderAsLaTeX('abs(sqrt(9) + 1)')).toContain(
            '\\left|\\sqrt{9}+1\\right|'
        );
        expect(ctx.renderAsLaTeX('sqrt(2^(5-1))')).toContain('\\sqrt{2^{5-1}}');
    });

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
