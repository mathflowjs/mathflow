function gcd2(a: number, b: number): number {
    return b ? gcd2(b, a % b) : Math.abs(a);
}

// modular exponentiation, in BigInt so that a large modulus cannot overflow
function modExp(base: number, exponent: number, modulus: number): number {
    if (modulus <= 0 || exponent < 0) return NaN;

    let result = 1n;
    let b = BigInt(Math.trunc(base));
    let e = BigInt(Math.trunc(exponent));
    const m = BigInt(Math.trunc(modulus));

    b = ((b % m) + m) % m;

    while (e > 0n) {
        if (e % 2n === 1n) result = (result * b) % m;
        b = (b * b) % m;
        e /= 2n;
    }

    return Number(result);
}

export default function initNumbers() {
    return {
        add: (...x: number[]) => x.reduce((s, c) => s + c, 0),
        sub: (x: number, y: number) => x - y,
        mul: (...x: number[]) => x.reduce((s, c) => s * c, 1),
        div: (x: number, y: number) => x / y,
        mod: (x: number, y: number) => x % y,
        abs: (x: number) => Math.abs(x),
        sign: (x: number) => Math.sign(x),
        ceil: (x: number) => Math.ceil(x),
        floor: (x: number) => Math.floor(x),
        sqrt: (x: number) => Math.sqrt(x),
        pow: (x: number, y: number) => Math.pow(x, y),
        cbrt: (x: number) => Math.cbrt(x),
        root: (x: number, y: number) =>
            // an odd root of a negative number is real: root(-8, 3) is -2
            x < 0 && Number.isInteger(y) && y % 2 !== 0
                ? -Math.pow(-x, 1 / y)
                : Math.pow(x, 1 / y),
        trunc: (x: number) => Math.trunc(x),
        round: (x: number, n = 0) => {
            const scale = 10 ** n;
            return Math.round(x * scale) / scale;
        },
        roundToNearest: (x: number, step: number) =>
            Math.round(x / step) * step,
        // `toPrecision` only accepts 1..100 significant digits
        precision: (x: number, n: number) =>
            Number(x.toPrecision(Math.min(Math.max(Math.trunc(n), 1), 100))),
        clamp: (x: number, min: number, max: number) =>
            Math.min(Math.max(x, min), max),
        gcd: (...x: number[]) => x.map(Math.trunc).reduce(gcd2, 0),
        lcm: (...x: number[]) =>
            x
                .map(Math.trunc)
                .reduce(
                    (a, b) => (a && b ? Math.abs(a * b) / gcd2(a, b) : 0),
                    1
                ),
        modExp,
        lerp: (a: number, b: number, t: number) => a + (b - a) * t,
        hermite: (
            p0: number,
            m0: number,
            p1: number,
            m1: number,
            t: number
        ) => {
            const t2 = t * t;
            const t3 = t2 * t;

            return (
                (2 * t3 - 3 * t2 + 1) * p0 +
                (t3 - 2 * t2 + t) * m0 +
                (-2 * t3 + 3 * t2) * p1 +
                (t3 - t2) * m1
            );
        }
    };
}
