// Lanczos approximation, g = 7
const LANCZOS = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
];

const SQRT_2PI = Math.sqrt(2 * Math.PI);

function series(x: number): number {
    let a = LANCZOS[0];
    for (let i = 1; i < LANCZOS.length; i++) a += LANCZOS[i] / (x + i);
    return a;
}

function gamma(x: number): number {
    // poles at zero and the negative integers
    if (Number.isInteger(x) && x <= 0) return NaN;

    // reflection, since the approximation only holds for x >= 0.5
    if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));

    x -= 1;
    const t = x + 7.5;

    return SQRT_2PI * t ** (x + 0.5) * Math.exp(-t) * series(x);
}

function lngamma(x: number): number {
    if (x < 0.5) {
        return (
            Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lngamma(1 - x)
        );
    }

    x -= 1;
    const t = x + 7.5;

    return (
        Math.log(SQRT_2PI) + (x + 0.5) * Math.log(t) - t + Math.log(series(x))
    );
}

// regularized lower incomplete gamma, by series - converges for x < a + 1
function gammaSeries(a: number, x: number): number {
    let term = 1 / a;
    let sum = term;
    let n = a;

    for (let i = 0; i < 300; i++) {
        n++;
        term *= x / n;
        sum += term;
        if (Math.abs(term) < Math.abs(sum) * 1e-16) break;
    }

    return sum * Math.exp(-x + a * Math.log(x) - lngamma(a));
}

// regularized upper incomplete gamma, by continued fraction - for x >= a + 1
function gammaFraction(a: number, x: number): number {
    const tiny = 1e-300;

    let b = x + 1 - a;
    let c = 1 / tiny;
    let d = 1 / b;
    let h = d;

    for (let i = 1; i < 300; i++) {
        const an = -i * (i - a);

        b += 2;
        d = an * d + b;
        if (Math.abs(d) < tiny) d = tiny;
        c = b + an / c;
        if (Math.abs(c) < tiny) c = tiny;
        d = 1 / d;

        const delta = d * c;
        h *= delta;

        if (Math.abs(delta - 1) < 1e-16) break;
    }

    return Math.exp(-x + a * Math.log(x) - lngamma(a)) * h;
}

// P(a, x)
function gammaRegularized(a: number, x: number): number {
    if (a <= 0 || x < 0) return NaN;
    if (x === 0) return 0;

    return x < a + 1 ? gammaSeries(a, x) : 1 - gammaFraction(a, x);
}

function erf(x: number): number {
    if (x === 0) return 0;
    return Math.sign(x) * gammaRegularized(0.5, x * x);
}

function digamma(x: number): number {
    if (Number.isInteger(x) && x <= 0) return NaN;

    // reflection
    if (x < 0) return digamma(1 - x) - Math.PI / Math.tan(Math.PI * x);

    let result = 0;

    // shift upwards, where the asymptotic series is accurate
    while (x < 6) {
        result -= 1 / x;
        x++;
    }

    const i = 1 / x;
    const i2 = i * i;

    return (
        result +
        Math.log(x) -
        0.5 * i -
        i2 *
            (1 / 12 -
                i2 * (1 / 120 - i2 * (1 / 252 - i2 * (1 / 240 - i2 / 132))))
    );
}

function zeta(s: number): number {
    if (s === 1) return Infinity;
    if (s === 0) return -0.5;

    // functional equation, for the half plane the series does not cover
    if (s < 0.5) {
        return (
            2 ** s *
            Math.PI ** (s - 1) *
            Math.sin((Math.PI * s) / 2) *
            gamma(1 - s) *
            zeta(1 - s)
        );
    }

    // alternating series, accelerated (Cohen-Rodriguez Villegas-Zagier)
    const n = 30;

    let d = (3 + Math.sqrt(8)) ** n;
    d = (d + 1 / d) / 2;

    let b = -1;
    let c = -d;
    let sum = 0;

    for (let k = 0; k < n; k++) {
        c = b - c;
        sum += c / (k + 1) ** s;
        b = ((k + n) * (k - n) * b) / ((k + 0.5) * (k + 1));
    }

    return sum / (d * (1 - 2 ** (1 - s)));
}

// principal branch, by Halley iteration
function lambertW(x: number): number {
    const lower = -1 / Math.E;

    if (x < lower) return NaN;
    if (x === lower) return -1;
    if (x === 0) return 0;

    let w = x < 10 ? Math.log1p(x) : Math.log(x) - Math.log(Math.log(x));

    for (let i = 0; i < 100; i++) {
        const e = Math.exp(w);
        const f = w * e - x;
        const step = f / (e * (w + 1) - ((w + 2) * f) / (2 * w + 2));

        w -= step;

        if (Math.abs(step) < 1e-15 * Math.max(1, Math.abs(w))) break;
    }

    return w;
}

export default function initSpecial() {
    return {
        gamma,
        lngamma,
        digamma,
        zeta,
        lambertW,
        erf,
        erfc: (x: number) => 1 - erf(x),
        beta: (a: number, b: number) =>
            a > 0 && b > 0
                ? Math.exp(lngamma(a) + lngamma(b) - lngamma(a + b))
                : (gamma(a) * gamma(b)) / gamma(a + b),
        // the lower incomplete gamma, unregularized
        gammaIncomplete: (a: number, x: number) =>
            gammaRegularized(a, x) * gamma(a),
        // unnormalized, in radians - an angle preference does not apply
        sinc: (x: number) => (x === 0 ? 1 : Math.sin(x) / x),
        heaviside: (x: number) => (x < 0 ? 0 : x > 0 ? 1 : 0.5)
    };
}
