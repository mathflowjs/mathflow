import { describe, test, expect, beforeEach } from 'vitest';
import { type IContextAPI, createContext } from '../src/context';

let ctx: IContextAPI;

beforeEach(() => {
    ctx = createContext({ preferences: { angles: 'deg' } });
});

// every case goes through `solve` rather than `ctx.functions`, so a builtin
// that was never registered fails here instead of lexing as a variable
function check(cases: [string, number][]) {
    for (const [expr, expected] of cases) {
        expect(ctx.solve(expr).value, expr).toBeCloseTo(expected, 8);
    }
}

describe('numbers', () => {
    test('rounding', () => {
        check([
            ['sign(-3)', -1],
            ['sign(0)', 0],
            ['round(2.567, 2)', 2.57],
            ['round(2.5)', 3],
            ['round(-1.4)', -1],
            ['fix(-2.7)', -2],
            ['trunc(2.7)', 2],
            ['roundToNearest(7, 5)', 5],
            ['roundToNearest(8, 5)', 10],
            ['precision(3.14159, 3)', 3.14],
            ['sigFigs(123456, 2)', 120000],
            ['clamp(5, 1, 3)', 3],
            ['clamp(0, 1, 3)', 1],
            ['clamp(2, 1, 3)', 2]
        ]);
    });

    test('divisors and interpolation', () => {
        check([
            ['gcd(12, 18)', 6],
            ['gcd(12, 18, 24)', 6],
            ['gcd(7, 13)', 1],
            ['lcm(4, 6)', 12],
            ['lcm(4, 6, 10)', 60],
            ['lcm(0, 5)', 0],
            ['modExp(2, 10, 1000)', 24],
            ['modExp(4, 13, 497)', 445],
            ['lerp(0, 10, 0.25)', 2.5],
            ['hermite(0, 0, 1, 0, 0.5)', 0.5],
            ['hermite(0, 0, 1, 0, 1)', 1]
        ]);
    });
});

describe('trigonometry', () => {
    test('degree variants are independent of the angle preference', () => {
        ctx.preferences.angles = 'rad';
        check([
            ['sind(30)', 0.5],
            ['cosd(60)', 0.5],
            ['tand(45)', 1],
            ['versind(0)', 0],
            ['coversind(90)', 0]
        ]);
    });

    test('inverse functions take a ratio and return an angle', () => {
        check([
            ['asin(0.5)', 30],
            ['acos(0.5)', 60],
            ['atan(1)', 45],
            ['atan2(1, 1)', 45],
            ['atan2(0, -1)', 180]
        ]);

        ctx.preferences.angles = 'rad';
        check([
            ['asin(0.5)', Math.PI / 6],
            ['atan2(1, 1)', Math.PI / 4]
        ]);
    });

    test('hyperbolic functions ignore the angle preference', () => {
        check([
            ['sinh(1)', Math.sinh(1)],
            ['cosh(1)', Math.cosh(1)],
            ['tanh(1)', Math.tanh(1)],
            ['asinh(1)', Math.asinh(1)],
            ['acosh(2)', Math.acosh(2)],
            ['atanh(0.5)', Math.atanh(0.5)]
        ]);
    });
});

describe('statistics', () => {
    test('totals and averages', () => {
        check([
            ['sum(1, 2, 3)', 6],
            ['prod(2, 3, 4)', 24],
            ['min(4, 9, 2)', 2],
            ['max(4, 9, 2)', 9],
            ['mean(1, 2, 3)', 2],
            ['median(1, 2, 3, 4)', 2.5],
            ['median(3, 1, 2)', 2],
            ['mode(1, 2, 2, 3)', 2],
            // the smallest value wins a tie
            ['mode(1, 1, 2, 2)', 1],
            ['geometricMean(1, 4, 16)', 4],
            ['harmonicMean(1, 2, 4)', 3 / 1.75]
        ]);
    });

    test('spread and shape', () => {
        check([
            // sample variance, the (n - 1) normalization
            ['variance(2, 4, 4, 4, 5, 5, 7, 9)', 32 / 7],
            ['std(2, 4, 4, 4, 5, 5, 7, 9)', Math.sqrt(32 / 7)],
            ['variance(5)', 0],
            ['mad(1, 2, 3, 4)', 1],
            ['quantile(0.5, 1, 2, 3, 4)', 2.5],
            ['quantile(0, 3, 1, 2)', 1],
            ['quantile(1, 3, 1, 2)', 3],
            ['entropy(0.5, 0.5)', Math.LN2],
            ['entropy(1, 1, 1, 1)', Math.log(4)],
            ['skewness(1, 2, 3)', 0],
            ['kurtosis(1, 2, 3, 4, 5)', -1.3]
        ]);
    });
});

describe('logarithms', () => {
    test('exponents and logs', () => {
        check([
            ['pow10(3)', 1000],
            ['pow2(10)', 1024],
            ['expm1(0)', 0],
            ['expm1(1)', Math.E - 1],
            ['log1p(0)', 0],
            ['log1p(1)', Math.LN2],
            ['log(100)', 2],
            ['log2(64)', 6]
        ]);
    });
});
