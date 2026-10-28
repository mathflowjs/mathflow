// 171! overflows a double, so there is nothing to gain by looping further
const MAX_FACTORIAL = 170;

function factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > MAX_FACTORIAL) return Infinity;

    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;

    return result;
}

// multiplicative form, which stays exact far longer than n! / (k! (n - k)!)
function combinations(n: number, k: number): number {
    n = Math.trunc(n);
    k = Math.trunc(k);

    if (n < 0 || k < 0 || k > n) return 0;

    k = Math.min(k, n - k);

    let result = 1;
    for (let i = 1; i <= k; i++) result = (result * (n - k + i)) / i;

    return Math.round(result);
}

function permutations(n: number, k: number): number {
    n = Math.trunc(n);
    k = Math.trunc(k);

    if (n < 0 || k < 0 || k > n) return 0;

    let result = 1;
    for (let i = 0; i < k; i++) result *= n - i;

    return result;
}

function isPrime(n: number): number {
    if (!Number.isInteger(n) || n < 2) return 0;
    if (n < 4) return 1;
    if (n % 2 === 0) return 0;

    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return 0;
    }

    return 1;
}

function fibonacci(n: number): number {
    if (n < 0 || !Number.isInteger(n)) return NaN;

    let a = 0;
    let b = 1;

    for (let i = 0; i < n; i++) [a, b] = [b, a + b];

    return a;
}

export default function initProbability() {
    return {
        factorial,
        combinations,
        permutations,
        isPrime,
        fibonacci,
        stirlingApproximation: (n: number) =>
            Math.sqrt(2 * Math.PI * n) * (n / Math.E) ** n,
        // random(), random(max) and random(min, max)
        random: (min?: number, max?: number) => {
            if (min === undefined) return Math.random();
            if (max === undefined) return Math.random() * min;
            return min + Math.random() * (max - min);
        },
        randomInt: (min?: number, max?: number) => {
            if (min === undefined) return Math.round(Math.random());
            if (max === undefined) return Math.floor(Math.random() * min);
            return min + Math.floor(Math.random() * (max - min));
        },
        pickRandom: (...x: number[]) =>
            x.length ? x[Math.floor(Math.random() * x.length)] : NaN,
        // the chance that two of `n` share one of `days` days
        birthdayProblem: (n: number, days = 365) => {
            n = Math.trunc(n);

            if (n < 0 || days <= 0) return NaN;
            if (n > days) return 1;

            let distinct = 1;
            for (let i = 0; i < n; i++) distinct *= (days - i) / days;

            return 1 - distinct;
        }
    };
}
