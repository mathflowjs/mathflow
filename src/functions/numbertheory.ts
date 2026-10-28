export default function initNumberTheory() {
    return {
        // euler's totient - how many of 1..n are coprime to n
        totient: (n: number) => {
            n = Math.trunc(n);
            if (n < 1) return NaN;

            let result = n;

            for (let p = 2; p * p <= n; p++) {
                if (n % p !== 0) continue;
                while (n % p === 0) n /= p;
                result -= result / p;
            }

            if (n > 1) result -= result / n;

            return result;
        },
        // 0 if n has a squared prime factor, otherwise +/-1 by parity
        mobius: (n: number) => {
            n = Math.trunc(n);
            if (n < 1) return NaN;

            let primes = 0;

            for (let p = 2; p * p <= n; p++) {
                if (n % p !== 0) continue;

                n /= p;
                if (n % p === 0) return 0;

                primes++;
            }

            if (n > 1) primes++;

            return primes % 2 === 0 ? 1 : -1;
        },
        isPerfectSquare: (n: number) => {
            if (!Number.isInteger(n) || n < 0) return 0;

            const root = Math.round(Math.sqrt(n));

            return root * root === n ? 1 : 0;
        }
    };
}
