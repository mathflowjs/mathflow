import { config, evaluate } from '../src/index';

describe('mathflow - evaluate', () => {
    test('evaluation result', () => {
        expect(() => evaluate('')).not.toThrow();
        expect(() => evaluate('')).toBeDefined();
        expect(evaluate('')).toMatchObject({
            value: 0,
            scope: { variables: {} },
            solution: []
        });
    });

    test('comments', () => {
        expect(() => evaluate(`# this is a comment`)).not.toThrow();
    });

    test('variable declaration', () => {
        expect(evaluate(`a = 1`)).toHaveProperty('scope', {
            variables: { a: 1 }
        });
        expect(evaluate(`a = 1, b = 2`)).toHaveProperty('scope', {
            variables: { a: 1, b: 2 }
        });
        expect(evaluate(`x1 = 3, x23 = 4`)).toHaveProperty('scope', {
            variables: { x1: 3, x23: 4 }
        });
    });

    test('binary operators', () => {
        expect(evaluate(`1 + 2`)).toHaveProperty('value', 3);
        expect(evaluate(`1 - 2`)).toHaveProperty('value', -1);
        expect(evaluate(`3 * 2`)).toHaveProperty('value', 6);
        expect(evaluate(`10 / 5`)).toHaveProperty('value', 2);
        expect(evaluate(`2^3`)).toHaveProperty('value', 8);

        expect(() => evaluate(`2+`)).toThrow();
        expect(() => evaluate(`2-`)).toThrow();
        expect(() => evaluate(`2*`)).toThrow();
        expect(() => evaluate(`2/`)).toThrow();
        expect(() => evaluate(`2^`)).toThrow();
    });

    test('unary operators', () => {
        expect(evaluate(`-1`)).toHaveProperty('value', -1);
        expect(evaluate(`+2`)).toHaveProperty('value', 2);
        expect(evaluate(`+2 -1`)).toHaveProperty('value', 1);
        expect(evaluate(`2- -1`)).toHaveProperty('value', 3);
        expect(evaluate(`2 + -1`)).toHaveProperty('value', 1);
        expect(evaluate(`2^+1`)).toHaveProperty('value', 2);

        expect(() => evaluate(`-2-`)).toThrow();
        expect(() => evaluate(`+2-`)).toThrow();

        expect(() => evaluate(`*2`)).toThrow();
        expect(() => evaluate(`/2`)).toThrow();
        expect(() => evaluate(`^2`)).toThrow();
    });

    test('built-in constants', () => {
        expect(evaluate(`pi`).value).toBeCloseTo(Math.PI);
        expect(evaluate(`e`).value).toBeCloseTo(Math.E);
    });

    test('built-in functions', () => {
        expect(evaluate(`exp(1)`).value).toBeCloseTo(Math.exp(1));
        expect(evaluate(`ln(2)`).value).toBeCloseTo(Math.log(2));
        // expect(evaluate(`log10(100)`).value).toBeCloseTo(Math.log10(100));
        expect(evaluate(`sqrt(4)`).value).toBeCloseTo(Math.sqrt(4));

        expect(evaluate(`sin(pi/2)`).value).toBeCloseTo(1);
        expect(evaluate(`cosd(60)`).value).toBeCloseTo(0.5);
        expect(evaluate(`tand(45)`).value).toBeCloseTo(1);

        expect(evaluate(`asin(0.5)`).value).toBeCloseTo(Math.PI / 6);
        expect(evaluate(`acos(0.5)`).value).toBeCloseTo(Math.PI / 3);
        expect(evaluate(`atan(1)`).value).toBeCloseTo(Math.PI / 4);

        expect(evaluate(`rad(10)`).value).toBeCloseTo((10 * Math.PI) / 180);
        expect(evaluate(`deg(5)`).value).toBeCloseTo((5 * 180) / Math.PI);
    });

    test('expansion', () => {
        expect(evaluate(`2(1+3)`).value).toBe(2 * (1 + 3));
        // expect(evaluate(`2log10(100)`).value).toBe(2 * Math.log10(100));
        // expect(evaluate(`2log10(10*100)`).value).toBe(2 * Math.log10(10 * 100));
    });

    test('full program', () => {
        expect(
            evaluate(`
                # this is a comment
                a = 1, b = 2, c = a + b
                # return value
                a + b + c
            `)
        ).toMatchObject({
            value: 6,
            scope: { variables: { a: 1, b: 2, c: 3 } }
        });
    });
});

describe('mathflow - config', () => {
    test('fraction digits', () => {
        expect(evaluate('1/6').value).toBe(0.1667);
        config.fractionDigits = 2;
        expect(evaluate('1/6').value).toBe(0.17);
        config.fractionDigits = 6;
        expect(evaluate('1/6').value).toBe(0.166_667);
    });
});
