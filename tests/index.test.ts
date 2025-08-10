import { describe, test, expect, beforeEach } from 'vitest';
import { compute } from '../src/compute';
import { Context, createContext } from '../src/context';

let ctx: Context;

beforeEach(() => {
    ctx = createContext({
        preferences: {
            angles: 'rad'
        }
    });
});

describe('mathflow - evaluate', () => {
    test('evaluation result', () => {
        expect(() => compute(ctx, '')).not.toThrow();
        expect(() => compute(ctx, '')).toBeDefined();
        expect(compute(ctx, '')).toMatchObject({
            value: 0
        });
    });

    test('comments', () => {
        expect(() => compute(ctx, `# this is a comment`)).not.toThrow();
    });

    test('variable declaration', () => {
        expect(compute(ctx, `a = 1`)).toHaveProperty('value', 1);
        expect(ctx.variables.has('a')).toBeTruthy();
        expect(ctx.variables.get('a')).toEqual(1);
    });

    test('binary operators', () => {
        expect(compute(ctx, `1 + 2`)).toHaveProperty('value', 3);
        expect(compute(ctx, `1 - 2`)).toHaveProperty('value', -1);
        expect(compute(ctx, `3 * 2`)).toHaveProperty('value', 6);
        expect(compute(ctx, `10 / 5`)).toHaveProperty('value', 2);
        expect(compute(ctx, `2^3`)).toHaveProperty('value', 8);

        expect(() => compute(ctx, `2+`)).toThrow();
        expect(() => compute(ctx, `2-`)).toThrow();
        expect(() => compute(ctx, `2*`)).toThrow();
        expect(() => compute(ctx, `2/`)).toThrow();
        expect(() => compute(ctx, `2^`)).toThrow();
    });

    test('unary operators', () => {
        expect(compute(ctx, `-1`)).toHaveProperty('value', -1);
        expect(compute(ctx, `+2`)).toHaveProperty('value', 2);
        expect(compute(ctx, `+2 -1`)).toHaveProperty('value', 1);
        expect(compute(ctx, `2- -1`)).toHaveProperty('value', 3);
        expect(compute(ctx, `2 + -1`)).toHaveProperty('value', 1);
        expect(compute(ctx, `2^+1`)).toHaveProperty('value', 2);

        expect(() => compute(ctx, `-2-`)).toThrow();
        expect(() => compute(ctx, `+2-`)).toThrow();

        expect(() => compute(ctx, `*2`)).toThrow();
        expect(() => compute(ctx, `/2`)).toThrow();
        expect(() => compute(ctx, `^2`)).toThrow();
    });

    test('built-in constants', () => {
        expect(compute(ctx, `pi`).value).toBeCloseTo(Math.PI);
    });

    test('built-in functions', () => {
        expect(compute(ctx, `exp(1)`).value).toBeCloseTo(Math.exp(1));
        expect(compute(ctx, `ln(2)`).value).toBeCloseTo(Math.log(2));
        expect(compute(ctx, `sqrt(4)`).value).toBeCloseTo(Math.sqrt(4));

        expect(compute(ctx, `sin(pi/2)`).value).toBeCloseTo(1);
        expect(compute(ctx, `cos(pi/3)`).value).toBeCloseTo(0.5);
        expect(compute(ctx, `tan(pi/4)`).value).toBeCloseTo(1);

        expect(compute(ctx, `asin(0.5)`).value).toBeCloseTo(Math.PI / 6);
        expect(compute(ctx, `acos(0.5)`).value).toBeCloseTo(Math.PI / 3);
        expect(compute(ctx, `atan(1)`).value).toBeCloseTo(Math.PI / 4);

        expect(compute(ctx, `rad(10)`).value).toBeCloseTo((10 * Math.PI) / 180);
        expect(compute(ctx, `deg(5)`).value).toBeCloseTo((5 * 180) / Math.PI);
    });

    test('implicit multiplication', () => {
        expect(compute(ctx, `2(1+3)`).value).toBe(2 * (1 + 3));
        expect(compute(ctx, `(1+3)2`).value).toBe((1 + 3) * 2);
        expect(compute(ctx, `(3)(2)`).value).toBe(3 * 2);
        expect(compute(ctx, `(5-2)(1+3)`).value).toBe((5 - 2) * (1 + 3));
    });

    // test('batch script', () => {
    //     const expr = `
    //         # this is a comment
    //         a = 1, b = 2, c = a + b
    //         # return value
    //         a + b + c
    //     `
    //     expect(() => computeBatch(ctx, expr)).not.toThrow()
    // });
});
