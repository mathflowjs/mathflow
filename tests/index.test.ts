import { describe, test, expect, beforeEach } from 'vitest';
import { type IContextAPI, createContext } from '../src/context';

let ctx: IContextAPI;

beforeEach(() => {
    ctx = createContext({
        preferences: {
            angles: 'rad'
        }
    });
});

describe('mathflow - evaluate', () => {
    test('evaluation result', () => {
        expect(() => ctx.solve('')).not.toThrow();
        expect(() => ctx.solve('')).toBeDefined();
        expect(ctx.solve('')).toMatchObject({
            value: 0
        });
    });

    test('comments', () => {
        expect(() => ctx.solve(`# this is a comment`)).not.toThrow();
    });

    test('variable declaration', () => {
        expect(ctx.solve(`a = 1`)).toHaveProperty('value', 1);
        expect(ctx.variables.has('a')).toBeTruthy();
        expect(ctx.variables.get('a')).toEqual(1);
    });

    test('binary operators', () => {
        expect(ctx.solve(`1 + 2`)).toHaveProperty('value', 3);
        expect(ctx.solve(`1 - 2`)).toHaveProperty('value', -1);
        expect(ctx.solve(`3 * 2`)).toHaveProperty('value', 6);
        expect(ctx.solve(`10 / 5`)).toHaveProperty('value', 2);
        expect(ctx.solve(`2^3`)).toHaveProperty('value', 8);

        expect(() => ctx.solve(`2+`)).toThrow();
        expect(() => ctx.solve(`2-`)).toThrow();
        expect(() => ctx.solve(`2*`)).toThrow();
        expect(() => ctx.solve(`2/`)).toThrow();
        expect(() => ctx.solve(`2^`)).toThrow();
    });

    test('unary operators', () => {
        expect(ctx.solve(`-1`)).toHaveProperty('value', -1);
        expect(ctx.solve(`+2`)).toHaveProperty('value', 2);
        expect(ctx.solve(`+2 -1`)).toHaveProperty('value', 1);
        expect(ctx.solve(`2- -1`)).toHaveProperty('value', 3);
        expect(ctx.solve(`2 + -1`)).toHaveProperty('value', 1);
        expect(ctx.solve(`2^+1`)).toHaveProperty('value', 2);

        expect(() => ctx.solve(`-2-`)).toThrow();
        expect(() => ctx.solve(`+2-`)).toThrow();

        expect(() => ctx.solve(`*2`)).toThrow();
        expect(() => ctx.solve(`/2`)).toThrow();
        expect(() => ctx.solve(`^2`)).toThrow();
    });

    test('operator precedence', () => {
        // `^` is right-associative, and binds tighter than unary minus
        expect(ctx.solve(`2^3^2`)).toHaveProperty('value', 512);
        expect(ctx.solve(`-2^2`)).toHaveProperty('value', -4);
        expect(ctx.solve(`(-2)^2`)).toHaveProperty('value', 4);
        expect(ctx.solve(`-2^2+1`)).toHaveProperty('value', -3);
        expect(ctx.solve(`2^-1`)).toHaveProperty('value', 0.5);
        expect(ctx.solve(`-2*3`)).toHaveProperty('value', -6);
        expect(ctx.solve(`2*-3`)).toHaveProperty('value', -6);
    });

    test('built-in constants', () => {
        expect(ctx.solve(`pi`).value).toBeCloseTo(Math.PI);
    });

    test('built-in functions', () => {
        expect(ctx.solve(`exp(1)`).value).toBeCloseTo(Math.exp(1));
        expect(ctx.solve(`ln(2)`).value).toBeCloseTo(Math.log(2));
        expect(ctx.solve(`sqrt(4)`).value).toBeCloseTo(Math.sqrt(4));

        expect(ctx.solve(`sin(pi/2)`).value).toBeCloseTo(1);
        expect(ctx.solve(`cos(pi/3)`).value).toBeCloseTo(0.5);
        expect(ctx.solve(`tan(pi/4)`).value).toBeCloseTo(1);

        expect(ctx.solve(`asin(0.5)`).value).toBeCloseTo(Math.PI / 6);
        expect(ctx.solve(`acos(0.5)`).value).toBeCloseTo(Math.PI / 3);
        expect(ctx.solve(`atan(1)`).value).toBeCloseTo(Math.PI / 4);

        expect(ctx.solve(`rad(10)`).value).toBeCloseTo((10 * Math.PI) / 180);
        expect(ctx.solve(`deg(5)`).value).toBeCloseTo((5 * 180) / Math.PI);
    });

    test('real roots, log bases and euclidean norms', () => {
        expect(ctx.solve(`cbrt(-8)`).value).toBe(-2);
        expect(ctx.solve(`root(-32,5)`).value).toBe(-2);
        expect(ctx.solve(`root(-4,2)`).value).toBeNaN();
        expect(ctx.solve(`log(8)`).value).toBeCloseTo(Math.log10(8));
        expect(ctx.solve(`log(8,2)`).value).toBeCloseTo(3);
        expect(ctx.solve(`hypot(1,2,2)`).value).toBeCloseTo(3);
        expect(ctx.solve(`coversin(0)`).value).toBeCloseTo(1);
        expect(ctx.solve(`versin(0)`).value).toBeCloseTo(0);
    });

    test('implicit multiplication', () => {
        expect(ctx.solve(`2(1+3)`).value).toBe(2 * (1 + 3));
        expect(ctx.solve(`(1+3)2`).value).toBe((1 + 3) * 2);
        expect(ctx.solve(`(3)(2)`).value).toBe(3 * 2);
        expect(ctx.solve(`(5-2)(1+3)`).value).toBe((5 - 2) * (1 + 3));
    });

    // test('batch script', () => {
    //     const expr = `
    //         # this is a comment
    //         a = 1, b = 2, c = a + b
    //         # return value
    //         a + b + c
    //     `
    //     expect(() => solveBatch(ctx, expr)).not.toThrow()
    // });
});
