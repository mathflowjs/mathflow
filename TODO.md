# MathFlow | TODO
A list of features to add to mathflow - based on numpy and more.

### **1. Numbers and Big Numbers**
- [ ]  `add(a, b, ...)`: Adds all numbers.
- [ ]  `subtract(a, b)`: Subtracts the second number from the first.
- [ ]  `multiply(a, b, ...)`: Multiplies all numbers.
- [ ]  `divide(a, b)`: Divides the first number by the second.
- [ ]  `mod(a, b)`: Returns the remainder of division of two numbers.
- [ ]  `abs(x)`: Returns the absolute value of a number.
- [ ]  `ceil(x)`: Rounds a number up to the nearest integer.
- [ ]  `floor(x)`: Rounds a number down to the nearest integer.
- [ ]  `round(x, n?)`: Rounds a number to the nearest integer or to `n` decimal places.
- [ ]  `sign(x)`: Returns the sign of a number: `-1`, `0`, or `1`.
- [x]  `sqrt(x)`: Returns the square root of a number.
- [ ]  `pow(x, y)`: Raises `x` to the power of `y`.
- [x]  `exp(x)`: Calculates the exponential of a number (`e^x`).
- [x]  `log(x, base?)`: Computes the logarithm of `x` with an optional base.
- [ ]  `factorial(n)`: Returns the factorial of a number.
- [ ]  `gcd(a, b, ...)`: Calculates the greatest common divisor of all numbers.
- [ ]  `lcm(a, b, ...)`: Computes the least common multiple of all numbers.
- [ ]  `random(min?, max?)`: Generates a random number within a specified range.
- [ ]  `randomInt(min, max)`: Generates a random integer between the specified min and max values.
- [ ]  `complex(re, im)`: Creates a complex number with real and imaginary parts.
- [ ]  `bignumber(x)`: Creates a big number with arbitrary precision.
- [ ]  `fraction(x)`: Creates a fraction from a number or a string.
- [ ]  `nthRoot(x, n)`: Computes the n-th root of a number.
- [ ]  `cbrt(x)`: Computes the cube root of a number.
- [ ]  `clamp(x, min, max)`: Clamps a value between a minimum and maximum value.
- [ ]  `modExp(base, exponent, modulus)`: Computes the modular exponentiation of a number.

### **2. Matrices and Arrays**
- [ ]  `matrix(data)`: Creates a matrix from an array or other data format.
- [ ]  `identity(n)`: Creates an identity matrix of size `n`.
- [ ]  `transpose(matrix)`: Returns the transpose of a matrix.
- [ ]  `det(matrix)`: Calculates the determinant of a matrix.
- [ ]  `inv(matrix)`: Computes the inverse of a matrix.
- [ ]  `concat(a, b, dim?)`: Concatenates two arrays or matrices along the specified dimension.
- [ ]  `size(matrix)`: Returns the size (dimensions) of a matrix.
- [ ]  `reshape(matrix, sizes)`: Reshapes a matrix to the specified sizes.
- [ ]  `flatten(matrix)`: Flattens a multi-dimensional matrix into a single dimension.
- [ ]  `dot(a, b)`: Computes the dot product of two vectors or matrices.
- [ ]  `cross(a, b)`: Calculates the cross product of two 3D vectors.
- [ ]  `subset(matrix, index, replacement?)`: Retrieves or sets a subset of a matrix.
- [ ]  `diag(matrix, k?)`: Extracts or creates a diagonal matrix.
- [ ]  `norm(matrix, p?)`: Computes the norm of a matrix or vector.
- [ ]  `trace(matrix)`: Computes the trace (sum of diagonal elements) of a matrix.
- [ ]  `zeros(m, n)`: Creates a matrix filled with zeros of specified dimensions.
- [ ]  `ones(m, n)`: Creates a matrix filled with ones of specified dimensions.
- [ ]  `range(start, end, step?)`: Generates an array of numbers from `start` to `end` with a specified step.
- [ ]  `sort(matrix, compare?)`: Sorts the elements of a matrix according to a compare function.
- [ ]  `magnitude(vector)`: Computes the magnitude (length) of a vector.
- [ ]  `normalize(vector)`: Normalizes a vector to a unit length.

### **3. Algebra**
- [ ]  `simplify(expr, rules?)`: Simplifies an algebraic expression using optional rules.
- [ ]  `solve(equation, variable?)`: Solves an equation for a specified variable.
- [ ]  `expand(expr)`: Expands an algebraic expression.
- [ ]  `evaluate(expr, scope?)`: Evaluates an expression given optional variable values.
- [ ]  `derivative(expr, variable)`: Computes the derivative of an expression with respect to a variable.
- [ ]  `parse(expr)`: Parses a string into an expression tree.
- [ ]  `rationalize(expr, scope?)`: Converts an expression into a rational fraction form.
- [ ]  `binomialCoefficient(n, k)`: Computes the binomial coefficient, representing combinations of `n` items taken `k` at a time.

### **4. Statistics**
- [ ]  `mean(arr)`: Computes the mean (average) of an array of numbers.
- [ ]  `median(arr)`: Finds the median value in an array of numbers.
- [ ]  `mode(arr)`: Identifies the mode (most frequent value) in an array.
- [ ]  `variance(arr, normalization?)`: Calculates the variance of a data set.
- [ ]  `std(arr, normalization?)`: Computes the standard deviation of a data set.
- [ ]  `sum(arr)`: Computes the sum of all elements in an array.
- [ ]  `prod(arr)`: Calculates the product of all elements in an array.
- [ ]  `min(arr)`: Finds the minimum value in an array.
- [ ]  `max(arr)`: Finds the maximum value in an array.
- [ ]  `quantileSeq(arr, prob, sorted?)`: Computes the specified quantile of a sorted array.
- [ ]  `mad(arr)`: Computes the mean absolute deviation of an array.
- [ ]  `entropy(arr)`: Calculates the entropy of a data set.
- [ ]  `covariance(arr1, arr2)`: Computes the covariance between two data sets.
- [ ]  `corr(arr1, arr2)`: Calculates the correlation coefficient between two data sets.
- [ ]  `weightedMean(values, weights)`: Computes the weighted mean of values given their weights.
- [ ]  `geometricMean(values)`: Calculates the geometric mean of a set of values.
- [ ]  `harmonicMean(values)`: Computes the harmonic mean of a set of values.
- [ ]  `skewness(arr)`: Measures the skewness of a data set, indicating asymmetry.
- [ ]  `kurtosis(arr)`: Measures the kurtosis of a data set, indicating the tails' heaviness.

### **5. Probability and Combinatorics**
- [ ]  `combinations(n, k)`: Calculates the number of ways to choose `k` items from `n`.
- [ ]  `permutations(n, k)`: Computes the number of ways to arrange `k` items out of `n`.
- [ ]  `random(min?, max?)`: Generates a random number within a range.
- [ ]  `randomInt(min, max)`: Generates a random integer between specified bounds.
- [ ]  `pickRandom(arr)`: Randomly selects an element from an array.
- [ ]  `shuffle(arr)`: Randomly shuffles the elements of an array.
- [ ]  `factorial(n)`: Computes the factorial of a number.
- [ ]  `stirlingApproximation(n)`: Approximates the factorial of `n` using Stirling's formula.
- [ ]  `isPrime(n)`: Checks if a number is a prime number.
- [ ]  `primeFactors(n)`: Returns the prime factors of a number.
- [ ]  `fibonacci(n)`: Calculates the n-th Fibonacci number.
- [ ]  `birthdayProblem(p, n)`: Computes the probability of a shared birthday in a group of `n`.

### **6. Trigonometry**
- [ ]  `deg(x)`: Converts the angle from radians to degrees.
- [ ]  `rad(x)`: Converts the angle from degrees to radians.
- [ ]  `sin(x)`: Computes the sine of an angle (in radians).
- [ ]  `cos(x)`: Computes the cosine of an angle (in radians).
- [ ]  `tan(x)`: Computes the tangent of an angle (in radians).
- [ ]  `sec(x)`: Computes the secant of an angle.
- [ ]  `csc(x)`: Computes the cosecant of an angle.
- [ ]  `cot(x)`: Computes the cotangent of an angle.
- [ ]  `asin(x)`: Computes the inverse sine of a value.
- [ ]  `acos(x)`: Computes the inverse cosine of a value.
- [ ]  `atan(x)`: Computes the inverse tangent of a value.
- [ ]  `atan2(y, x)`: Computes the angle from the x-axis to a point (`x`, `y`).
- [ ]  `sinh(x)`: Computes the hyperbolic sine of a value.
- [ ]  `cosh(x)`: Computes the hyperbolic cosine of a value.
- [ ]  `tanh(x)`: Computes the hyperbolic tangent of a value.
- [ ]  `asinh(x)`: Computes the inverse hyperbolic sine of a value.
- [ ]  `acosh(x)`: Computes the inverse hyperbolic cosine of a value.
- [ ]  `atanh(x)`: Computes the inverse hyperbolic tangent of a value.
- [ ]  `hypot(a, b, ...)`: Computes the square root of the sum of squares (Euclidean norm).
- [ ]  `versin(x)`: Computes the versine of an angle.
- [ ]  `coversin(x)`: Computes the coversine of an angle.

### **7. Calculus**
- [ ]  `derivative(expr, variable)`: Calculates the derivative of an expression.
- [ ]  `integrate(expr, variable)`: Computes the integral of an expression.
- [ ]  `numericDerivative(func, x)`: Numerically computes the derivative at a point.
### **8. Complex Numbers**
- [ ]  `complex(re, im)`: Creates a complex number from real and imaginary parts.
- [ ]  `re(complex)`: Extracts the real part of a complex number.
- [ ]  `im(complex)`: Extracts the imaginary part of a complex number.
- [ ]  `arg(complex)`: Computes the argument (phase angle) of a complex number.
- [ ]  `conj(complex)`: Returns the complex conjugate of a complex number.
- [ ]  `abs(complex)`: Computes the magnitude (absolute value) of a complex number.
- [ ]  `add(complex1, complex2)`: Adds two complex numbers.
- [ ]  `subtract(complex1, complex2)`: Subtracts the second complex number from the first.
- [ ]  `multiply(complex1, complex2)`: Multiplies two complex numbers.
- [ ]  `divide(complex1, complex2)`: Divides the first complex number by the second.
- [ ]  `sqrt(complex)`: Computes the square root of a complex number.
- [ ]  `exp(complex)`: Calculates the exponential of a complex number.
- [ ]  `log(complex)`: Computes the natural logarithm of a complex number.
- [ ]  `pow(complex, exponent)`: Raises a complex number to a specified power.
- [ ]  `phase(complex)`: Returns the phase angle (argument) of a complex number.

### **9. Special Functions**
- [ ]  `gamma(x)`: Computes the gamma function of `x`, an extension of the factorial.
- [ ]  `factorial(x)`: Calculates the factorial of a non-negative integer `x`.
- [ ]  `sinc(x)`: Computes the sinc function, defined as `sin(x)/x`.
- [ ]  `heaviside(x)`: Computes the Heaviside step function.
- [ ]  `erf(x)`: Computes the error function of `x`.
- [ ]  `beta(a, b)`: Calculates the beta function.
- [ ]  `lambertW(x)`: Computes the Lambert W function.
- [ ]  `digamma(x)`: Calculates the digamma function, the logarithmic derivative of the gamma function.
- [ ]  `zeta(s)`: Computes the Riemann zeta function of `s`.
- [ ]  `gammaIncomplete(a, x)`: Computes the incomplete gamma function.

### **10. Rounding and Precision**
- [ ]  `round(x, n?)`: Rounds a number to the nearest integer or `n` decimal places.
- [ ]  `floor(x)`: Rounds a number down to the nearest integer.
- [ ]  `ceil(x)`: Rounds a number up to the nearest integer.
- [ ]  `trunc(x)`: Removes the fractional part of a number, leaving the integer part.
- [ ]  `fix(x)`: Rounds towards zero, removing the fractional part.
- [ ]  `precision(x, n)`: Adjusts a number to `n` significant digits.
- [ ]  `sigFigs(x, n)`: Rounds a number to `n` significant figures.
- [ ]  `roundToNearest(x, step)`: Rounds `x` to the nearest multiple of `step`.

### **11. Exponential and Logarithmic Functions**
- [ ]  `exp(x)`: Computes `e` raised to the power of `x`.
- [ ]  `log(x, base?)`: Computes the logarithm of `x` with an optional base (defaults to natural log).
- [ ]  `log10(x)`: Computes the base-10 logarithm of `x`.
- [ ]  `log2(x)`: Computes the base-2 logarithm of `x`.
- [ ]  `pow10(exp)`: Computes `10` raised to the power of `exp`.
- [ ]  `pow2(exp)`: Computes `2` raised to the power of `exp`.
- [ ]  `expm1(x)`: Computes `e^x - [ ]  1`, useful for small values of `x` to reduce numerical error.
- [ ]  `log1p(x)`: Computes `log(1 + x)`, improving accuracy for small `x`.

### **12. Linear Algebra and Geometry**
- [ ]  `dotProduct(a, b)`: Computes the dot product of two vectors.
- [ ]  `crossProduct(a, b)`: Computes the cross product of two 3D vectors.
- [ ]  `projection(u, v)`: Projects vector `u` onto vector `v`.
- [ ]  `angleBetween(u, v)`: Calculates the angle between two vectors.
- [ ]  `distance(p1, p2)`: Computes the Euclidean distance between two points.
- [ ]  `reflect(point, line)`: Reflects a point over a line.
- [ ]  `intersect(line1, line2)`: Finds the intersection point of two lines.

### **13. Signal Processing**
- [ ]  `fft(arr)`: Computes the Fast Fourier Transform of an array.
- [ ]  `ifft(arr)`: Computes the inverse Fast Fourier Transform.
- [ ]  `dft(arr)`: Calculates the Discrete Fourier Transform of an array.
- [ ]  `idft(arr)`: Calculates the inverse Discrete Fourier Transform.
- [ ]  `convolve(arr1, arr2)`: Computes the convolution of two sequences.
- [ ]  `correlate(arr1, arr2)`: Computes the cross-correlation of two sequences.

### **14. Financial Math**
- [ ]  `futureValue(principal, rate, periods)`: Computes the future value of an investment.
- [ ]  `presentValue(futureValue, rate, periods)`: Computes the present value given the future value.
- [ ]  `compoundInterest(principal, rate, timesCompounded, periods)`: Calculates compound interest over time.
- [ ]  `annuityPayment(rate, periods, presentValue)`: Computes the payment amount of an annuity.

### **15. Interpolation and Approximation**
- [ ]  `lerp(a, b, t)`: Performs linear interpolation between two values `a` and `b` based on `t`.
- [ ]  `hermite(p0, p1, t)`: Performs Hermite interpolation.
- [ ]  `lagrange(points, x)`: Uses Lagrange polynomials to interpolate the value at `x`.
- [ ]  `spline(points, x)`: Computes spline interpolation at `x`.

### **16. Number Theory**
- [ ]  `totient(n)`: Computes Euler’s totient function of `n`.
- [ ]  `mobius(n)`: Computes the Möbius function of `n`.
- [ ]  `isPerfectSquare(n)`: Checks whether a number is a perfect square.
- [ ]  `divisors(n)`: Lists all divisors of a number `n`.
