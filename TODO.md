# MathFlow | TODO

A list of features for mathflow - based on numpy, mathjs and more.

## Scope

Every mathflow value is a plain number. A function is in scope when it takes
numbers and returns a single number; anything list-shaped is exposed as a
**variadic** builtin, so a data set is written `mean(1, 2, 3)` rather than
`mean([1, 2, 3])`.

Predicates return `1` or `0`, since there is no boolean type.

See [Not planned](#not-planned) for what this rules out, and why.

### **1. Numbers**

- [x] `add(a, b, ...)`: Adds all numbers.
- [x] `sub(a, b)`: Subtracts the second number from the first.
- [x] `mul(a, b, ...)`: Multiplies all numbers.
- [x] `div(a, b)`: Divides the first number by the second.
- [x] `mod(a, b)`: Returns the remainder of division of two numbers.
- [x] `abs(x)`: Returns the absolute value of a number.
- [x] `ceil(x)`: Rounds a number up to the nearest integer.
- [x] `floor(x)`: Rounds a number down to the nearest integer.
- [x] `sign(x)`: Returns the sign of a number: `-1`, `0`, or `1`.
- [x] `sqrt(x)`: Returns the square root of a number.
- [x] `pow(x, y)`: Raises `x` to the power of `y`.
- [x] `cbrt(x)`: Computes the cube root of a number.
- [x] `root(x, n)`: Computes the n-th root of a number.
- [x] `trunc(x)`: Removes the fractional part of a number.
- [x] `round(x, n?)`: Rounds to the nearest integer or to `n` decimal places.
- [x] `roundToNearest(x, step)`: Rounds `x` to the nearest multiple of `step`.
- [x] `precision(x, n)`: Adjusts a number to `n` significant digits.
- [x] `clamp(x, min, max)`: Clamps a value between a minimum and maximum.
- [x] `gcd(a, b, ...)`: Greatest common divisor of all numbers.
- [x] `lcm(a, b, ...)`: Least common multiple of all numbers.
- [x] `modExp(base, exponent, modulus)`: Modular exponentiation.
- [x] `lerp(a, b, t)`: Linear interpolation between `a` and `b`.
- [x] `hermite(p0, m0, p1, m1, t)`: Cubic Hermite interpolation.

### **2. Statistics**

All variadic - `mean(1, 2, 3)`, not `mean([1, 2, 3])`.

- [x] `sum(...x)`: Sum of all values.
- [x] `prod(...x)`: Product of all values.
- [x] `min(...x)`: Smallest value.
- [x] `max(...x)`: Largest value.
- [x] `mean(...x)`: Arithmetic mean.
- [x] `median(...x)`: Median value.
- [x] `mode(...x)`: Most frequent value, the smallest of them on a tie.
- [x] `quantile(p, ...x)`: Quantile at probability `p`, interpolated.
- [x] `variance(...x)`: Sample variance, the `n - 1` normalization.
- [x] `std(...x)`: Sample standard deviation.
- [x] `mad(...x)`: Mean absolute deviation.
- [x] `entropy(...x)`: Shannon entropy in nats, over the given distribution.
- [x] `geometricMean(...x)`: Geometric mean.
- [x] `harmonicMean(...x)`: Harmonic mean.
- [x] `skewness(...x)`: Skewness, indicating asymmetry.
- [x] `kurtosis(...x)`: Excess kurtosis - `0` for a normal distribution.

### **3. Probability and Combinatorics**

- [x] `factorial(n)`: Factorial of `n`.
- [x] `combinations(n, k)`: Ways to choose `k` items from `n`.
- [x] `permutations(n, k)`: Ways to arrange `k` items out of `n`.
- [x] `stirlingApproximation(n)`: Approximates `n!` by Stirling's formula.
- [x] `isPrime(n)`: `1` if `n` is prime, else `0`.
- [x] `fibonacci(n)`: The n-th Fibonacci number.
- [x] `birthdayProblem(n, days?)`: Chance two of `n` share one of `days` days.
- [x] `random(min?, max?)`: Random number - unit, `[0, min)`, or `[min, max)`.
- [x] `randomInt(min?, max?)`: As `random`, truncated to an integer.
- [x] `pickRandom(...x)`: Randomly selects one of the given values.

### **4. Trigonometry**

- [x] `deg(x)`: Converts the angle from radians to degrees.
- [x] `rad(x)`: Converts the angle from degrees to radians.
- [x] `sin(x)`, `cos(x)`, `tan(x)`: In the context's angle unit.
- [x] `sind(x)`, `cosd(x)`, `tand(x)`: Always in degrees.
- [x] `sec(x)`, `csc(x)`, `cot(x)`: Reciprocal functions.
- [x] `asin(x)`, `acos(x)`, `atan(x)`: Take a ratio, return an angle.
- [x] `atan2(y, x)`: Angle from the x-axis to the point (`x`, `y`).
- [x] `sinh(x)`, `cosh(x)`, `tanh(x)`: Hyperbolic, on plain reals.
- [x] `asinh(x)`, `acosh(x)`, `atanh(x)`: Inverse hyperbolic, on plain reals.
- [x] `hypot(a, b, ...)`: Euclidean norm.
- [x] `versin(x)`, `coversin(x)`: Versine and coversine.
- [x] `versind(x)`, `coversind(x)`: The same, always in degrees.

### **5. Exponential and Logarithmic**

- [x] `exp(x)`: Computes `e` raised to the power of `x`.
- [x] `expm1(x)`: `e^x - 1`, accurate for small `x`.
- [x] `ln(x)`: Natural logarithm.
- [x] `log(x, base?)`: Logarithm of `x`, base 10 by default.
- [x] `log10(x)`, `log2(x)`: Base-10 and base-2 logarithms.
- [x] `log1p(x)`: `log(1 + x)`, accurate for small `x`.
- [x] `pow10(x)`, `pow2(x)`: Powers of 10 and 2.

### **6. Special Functions**

- [x] `gamma(x)`: Gamma function, an extension of the factorial.
- [x] `lngamma(x)`: Natural log of the gamma function.
- [x] `digamma(x)`: Logarithmic derivative of the gamma function.
- [x] `beta(a, b)`: Beta function.
- [x] `gammaIncomplete(a, x)`: Lower incomplete gamma, unregularized.
- [x] `erf(x)`, `erfc(x)`: Error function and its complement.
- [x] `zeta(s)`: Riemann zeta function.
- [x] `lambertW(x)`: Lambert W function, principal branch.
- [x] `sinc(x)`: Unnormalized `sin(x)/x`, always in radians.
- [x] `heaviside(x)`: Step function, `0.5` at the origin.

### **7. Number Theory**

- [x] `totient(n)`: Euler's totient function.
- [x] `mobius(n)`: Mobius function.
- [x] `isPerfectSquare(n)`: `1` if `n` is a perfect square, else `0`.

### **8. Financial Math**

- [x] `futureValue(principal, rate, periods)`: Future value of an investment.
- [x] `presentValue(future, rate, periods)`: Present value of a future sum.
- [x] `compoundInterest(principal, rate, times, periods)`: Accrued amount.
- [x] `annuityPayment(rate, periods, present)`: Level payment of an annuity.

## Not planned

Ruled out to keep every value a plain number and the library small.

**Needs an array value type** - matrices and vectors (`matrix`, `det`, `inv`,
`transpose`, `dot`, `cross`, `reshape`, `norm`, ...), signal processing
(`fft`, `dft`, `convolve`, `correlate`), and vector geometry (`projection`,
`angleBetween`, `reflect`, `intersect`).

**Returns a list rather than a number** - `shuffle`, `primeFactors`,
`divisors`, `range`, `lagrange`, `spline`.

**Needs two independent lists** - `covariance`, `corr`, `weightedMean`. These
cannot be written variadically.

**Needs a different numeric type** - `complex` and everything on it (`re`,
`im`, `arg`, `conj`, ...), plus `bignumber` and `fraction`.

**Symbolic, not numeric** - `simplify`, `expand`, `derivative`, `integrate`,
`rationalize`, and solving an equation for a variable. These need a computer
algebra system, which is a different project from an evaluator.

**Takes a function as a value** - `numericDerivative`. There is no function
type.

**Already covered** - one name per behaviour, so nothing is implemented twice:
`fix` is `trunc`, `sigFigs` is `precision`, `rand`/`randi` are
`random`/`randomInt`, and `binomialCoefficient` is `combinations`. `parse` and
`evaluate(expr, scope?)` are the public `parse` and `solve` APIs.
