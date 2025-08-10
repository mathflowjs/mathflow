import { describe, test, expect, beforeEach } from 'vitest';
import { Context, createContext } from '../src/context';
import { compute } from '../src';

let ctx: Context;

beforeEach(() => {
    ctx = createContext({
        variables: { x: 1 },
        preferences: {
            angles: 'deg'
        }
    });
});

describe('preferences', () => {
    test('angles in degrees', () => {
        expect(compute(ctx, 'sin(30)').value).toEqual(0.5);
    });

    test('angles in radians', () => {
        ctx.preferences.angles = 'rad';
        expect(compute(ctx, 'cos(pi/3)').value).toBeCloseTo(0.5);
    });

    test('fraction digits', () => {
        ctx.preferences.fractionDigits = 3;
        expect(compute(ctx, '2 / 3').value).toEqual(0.667);
    });

    test('precision in results', () => {
        ctx.preferences.precision = 4;
        expect(compute(ctx, '3pi - 1').value).toEqual(8.426);
    });
});

describe('pre-defined variables', () => {
    test('variables - read and write', () => {
        expect(compute(ctx, 'y = 2(x + 1)').value).toBe(4);
        expect(ctx.variables.get('y')).toEqual(4);
    });

    test('constants - read and write', () => {
        ctx.constants.set('y', 6);
        expect(() => compute(ctx, 'y = 2(x + 1)')).toThrow();
        expect(() => compute(ctx, 'x = 3y')).not.toThrow();
        expect(compute(ctx, 'x = 3y')).toHaveProperty('value', 18);
    });
});

describe('pre-defined functions', () => {
    test('custom math function', () => {
        ctx.functions.set('double', (x: number) => x * 2);
        expect(() => compute(ctx, 'double(3)')).not.toThrow();
        expect(compute(ctx, 'double(3)')).toHaveProperty('value', 6);
    });
});
