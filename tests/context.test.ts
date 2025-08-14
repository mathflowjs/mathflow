import { describe, test, expect, beforeEach } from 'vitest';
import { type ContextAPI, createContext } from '../src/context';

let ctx: ContextAPI;

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
        expect(ctx.solve('sin(30)').value).toEqual(0.5);
    });

    test('angles in radians', () => {
        ctx.preferences.angles = 'rad';
        expect(ctx.solve('cos(pi/3)').value).toBeCloseTo(0.5);
    });

    test('fraction digits', () => {
        ctx.preferences.fractionDigits = 3;
        expect(ctx.solve('2 / 3').value).toEqual(0.667);
    });

    test('precision in results', () => {
        ctx.preferences.precision = 4;
        expect(ctx.solve('3pi - 1').value).toEqual(8.426);
    });
});

describe('pre-defined variables', () => {
    test('variables - read and write', () => {
        expect(ctx.solve('y = 2(x + 1)').value).toBe(4);
        expect(ctx.variables.get('y')).toEqual(4);
    });

    test('constants - read and write', () => {
        ctx.constants.set('y', 6);
        expect(() => ctx.solve('y = 2(x + 1)')).toThrow();
        expect(() => ctx.solve('x = 3y')).not.toThrow();
        expect(ctx.solve('x = 3y')).toHaveProperty('value', 18);
    });
});

describe('pre-defined functions', () => {
    test('custom math function', () => {
        ctx.functions.set('double', (x: number) => x * 2);
        expect(() => ctx.solve('double(3)')).not.toThrow();
        expect(ctx.solve('double(3)')).toHaveProperty('value', 6);
    });
});

describe('context helpers', () => {
    test('solving single-line expressions', () => {
        expect(ctx).toHaveProperty('solve');
        expect(typeof ctx.solve).toBe('function');
        expect(ctx.solve('(1 + 1)(2 + 1)')).toHaveProperty('value', 6);
    });
    test('solving multiple-line expressions', () => {
        expect(ctx).toHaveProperty('solveBatch');
        expect(typeof ctx.solveBatch).toBe('function');
        expect(
            ctx.solveBatch(`x = 3sin(30)\ny = 2cos(60)\n\nx + y`)
        ).toStrictEqual([
            {
                solution: [
                    'x = (3 * sin(30))',
                    'x = (3 * 0.5)',
                    'x = 1.5',
                    '1.5'
                ],
                value: 1.5
            },
            {
                solution: ['y = (2 * cos(60))', 'y = (2 * 0.5)', 'y = 1', '1'],
                value: 1
            },
            {
                solution: ['1.5 + 1', '2.5'],
                value: 2.5
            }
        ]);
    });
});
