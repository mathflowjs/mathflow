const total = (x: number[]) => x.reduce((s, c) => s + c, 0);

const average = (x: number[]) => total(x) / x.length;

const ascending = (x: number[]) => [...x].sort((a, b) => a - b);

// central moment of order k, about the mean
function moment(x: number[], k: number): number {
    const m = average(x);
    return average(x.map((v) => (v - m) ** k));
}

// sample variance - the (n - 1) normalization, as in mathjs
function variance(x: number[]): number {
    if (x.length < 2) return 0;

    const m = average(x);
    return total(x.map((v) => (v - m) ** 2)) / (x.length - 1);
}

// linear interpolation between order statistics, as in numpy's default
function quantile(p: number, x: number[]): number {
    if (!x.length) return NaN;

    const values = ascending(x);
    const h = (values.length - 1) * Math.min(Math.max(p, 0), 1);
    const lower = Math.floor(h);
    const upper = Math.ceil(h);

    return values[lower] + (h - lower) * (values[upper] - values[lower]);
}

// the most frequent value, the smallest of them if several tie
function mode(x: number[]): number {
    const counts = new Map<number, number>();

    for (const v of x) counts.set(v, (counts.get(v) ?? 0) + 1);

    let best = NaN;
    let seen = 0;

    for (const v of ascending(x)) {
        const count = counts.get(v)!;
        if (count > seen) {
            best = v;
            seen = count;
        }
    }

    return best;
}

export default function initStatistics() {
    return {
        sum: (...x: number[]) => total(x),
        prod: (...x: number[]) => x.reduce((s, c) => s * c, 1),
        min: (...x: number[]) => Math.min(...x),
        max: (...x: number[]) => Math.max(...x),
        mean: (...x: number[]) => average(x),
        median: (...x: number[]) => quantile(0.5, x),
        mode: (...x: number[]) => mode(x),
        quantile: (p: number, ...x: number[]) => quantile(p, x),
        variance: (...x: number[]) => variance(x),
        std: (...x: number[]) => Math.sqrt(variance(x)),
        // mean absolute deviation
        mad: (...x: number[]) => {
            const m = average(x);
            return average(x.map((v) => Math.abs(v - m)));
        },
        // shannon entropy in nats, over the distribution the values describe
        entropy: (...x: number[]) => {
            const scale = total(x);
            return -total(
                x.map((v) => {
                    const p = v / scale;
                    return p > 0 ? p * Math.log(p) : 0;
                })
            );
        },
        geometricMean: (...x: number[]) =>
            Math.exp(average(x.map((v) => Math.log(v)))),
        harmonicMean: (...x: number[]) => x.length / total(x.map((v) => 1 / v)),
        skewness: (...x: number[]) => moment(x, 3) / moment(x, 2) ** 1.5,
        // excess kurtosis - 0 for a normal distribution
        kurtosis: (...x: number[]) => moment(x, 4) / moment(x, 2) ** 2 - 3
    };
}
