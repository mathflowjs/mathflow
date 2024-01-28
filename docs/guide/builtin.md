# Built-ins

## Constants

Mathflow comes with pre-defined universal constants to ease your workflow.

- `pi` - This is the ratio of the circumference of a circle to its diameter
- `e` - The mathematical constant _e_. This is Euler's number, the base of natural logarithms.

## Functions

Just like Mathematics, MathFlow has commonly used functions built in. A full list of those functions can be found in this [file](https://github.com/henryhale/mathflow/blob/master/src/global.ts).

-   `exp` - returns _e_ (the base of natural logarithms) raised to a power
-   `log` - returns the base 10 logarithm of a number
-   `ln` - returns the natural logarithm of a number
-   `deg` - convert radians into degrees
-   `rad` - convert degrees into radians
-   `sin` - returns the sine of a number in degrees
-   `cos` - returns the cosine of a number in degrees
-   `tan` - returns the tangent of a number in degrees
-   `asin` - equivalent to arcsine of a number
-   `acos` - equivalent to arcosine of a number
-   `atan` - equivalent to arctangent of a number
-   `sqrt` - returns the square root of a number

**Examples:**

These functions can take up a single number or expression.

```js
log(100)        // 2
sin(15 + 15)    // 0.5
cos(acos(0.5))  // 0.5
sqrt(4)         // 2
```
