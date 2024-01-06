# Programs

Here's a list of a few basic programs;

:::details Area of a triangle
```js
import { evaluate } from 'mathflow';

const script = `
# base
b = 1.4

# height
h = 4

# compute the area
A = 0.5 * b * h

# output the area
A
`;

const result = evaluate(script);

console.log(result);
// Output: { value: 2, scope: { variables: { b: 1.4, h: 4, A: 2.8 } } }
```
:::

:::details Gradient of a line
```js
import { evaluate } from 'mathflow';

const script = `
# Point A
x1 = 1
y1 = 1

# Point B
x2 = 3
y2 = 5

# Gradient
m = (y2 - y1) / (x2 - x1)

# Result
m
`;

const result = evaluate(script);

console.log(result);
// Output: { value: 2.8, scope: { variables: { x1: 1, y1: 1, x2: 3, y2: 5, m: 2 } } }
```
:::
