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
        const actual = ctx.solve(expr).value;

        if (Number.isNaN(expected)) {
            expect(actual, expr).toBeNaN();
            continue;
        }

        // relative, so a large result is not held to an absolute epsilon
        const tolerance = 1e-9 * Math.max(1, Math.abs(expected));

        expect(
            Math.abs(actual - expected),
            `${expr} gave ${actual}, expected ${expected}`
        ).toBeLessThanOrEqual(tolerance);
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

describe('probability', () => {
    test('counting', () => {
        check([
            ['factorial(0)', 1],
            ['factorial(5)', 120],
            ['factorial(-1)', NaN],
            ['combinations(5, 2)', 10],
            ['combinations(52, 5)', 2598960],
            ['combinations(5, 6)', 0],
            ['permutations(5, 2)', 20],
            ['permutations(5, 0)', 1],
            ['fibonacci(0)', 0],
            ['fibonacci(10)', 55],
            ['isPrime(1)', 0],
            ['isPrime(2)', 1],
            ['isPrime(97)', 1],
            ['isPrime(91)', 0],
            [
                'stirlingApproximation(10)',
                Math.sqrt(20 * Math.PI) * (10 / Math.E) ** 10
            ],
            ['birthdayProblem(23)', 0.5072972343],
            ['birthdayProblem(1)', 0],
            ['birthdayProblem(400)', 1]
        ]);
    });

    test('random values stay in range', () => {
        for (let i = 0; i < 50; i++) {
            const unit = ctx.solve('random()').value;
            expect(unit).toBeGreaterThanOrEqual(0);
            expect(unit).toBeLessThan(1);

            const scaled = ctx.solve('random(5, 10)').value;
            expect(scaled).toBeGreaterThanOrEqual(5);
            expect(scaled).toBeLessThan(10);

            const whole = ctx.solve('randomInt(1, 7)').value;
            expect(Number.isInteger(whole)).toBe(true);
            expect(whole).toBeGreaterThanOrEqual(1);
            expect(whole).toBeLessThan(7);

            expect([3, 5, 8]).toContain(ctx.solve('pickRandom(3, 5, 8)').value);
        }
    });
});

describe('special functions', () => {
    const EULER_MASCHERONI = 0.577215664901532;

    test('gamma and friends', () => {
        check([
            ['gamma(0.5)', Math.sqrt(Math.PI)],
            ['gamma(1)', 1],
            ['gamma(5)', 24],
            ['gamma(-0.5)', -2 * Math.sqrt(Math.PI)],
            ['gamma(0)', NaN],
            ['lngamma(10)', Math.log(362880)],
            ['digamma(1)', -EULER_MASCHERONI],
            ['digamma(2)', 1 - EULER_MASCHERONI],
            ['beta(2, 3)', 1 / 12],
            ['beta(1, 1)', 1],
            // the lower incomplete gamma: g(1, x) is 1 - e^-x
            ['gammaIncomplete(1, 1)', 1 - 1 / Math.E],
            ['gammaIncomplete(1, 0)', 0]
        ]);
    });

    test('error function', () => {
        check([
            ['erf(0)', 0],
            ['erf(1)', 0.842700792949715],
            ['erf(-1)', -0.842700792949715],
            ['erf(3)', 0.999977909503001],
            ['erfc(0)', 1],
            ['erfc(1)', 1 - 0.842700792949715]
        ]);
    });

    test('zeta and lambert w', () => {
        check([
            ['zeta(2)', Math.PI ** 2 / 6],
            ['zeta(4)', Math.PI ** 4 / 90],
            ['zeta(0)', -0.5],
            ['zeta(-1)', -1 / 12],
            ['zeta(-2)', 0],
            ['lambertW(0)', 0],
            ['lambertW(e)', 1],
            ['lambertW(1)', 0.567143290409784],
            // W(x)e^W(x) = x
            ['lambertW(10) * exp(lambertW(10))', 10]
        ]);
    });

    test('sinc and heaviside', () => {
        check([
            ['sinc(0)', 1],
            ['sinc(pi)', 0],
            ['heaviside(-2)', 0],
            ['heaviside(0)', 0.5],
            ['heaviside(2)', 1]
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
