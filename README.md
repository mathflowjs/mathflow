<div align=center>

![](https://github.com/mathflowjs/mathflow/blob/master/docs/public/logo.svg)

# Mathflow

_Simplifying Math, Empowering Code._

</div>

## Overview

Mathflow is a lightweight JavaScript library for evaluating mathematical expressions written in natural mathematical notation. It parses and computes standard arithmetic, trignometric functions, logarithms, and algebraic expressions exactly as you would write them on paper.

## Features

- **Natural syntax:** Write `2x + 3(y - 1)` instead of `2*x + 3*(y - 1)`. Both are supported anyway.
- **Step-by-step solutions:** Every result comes with the working out, one line per step.
- **Mathematical functions:** Over a hundred built-ins - trigonometry, logarithms, statistics, combinatorics, special functions and more.
- **Variables:** Assign and use variables like `x = 5`, `y = 5x - 1`
- **Clean & modern syntax:** Readable and easy-to-write syntax for mathematical expressions.
- **AST-based parsing:** Proper order of operations and expression evaluation.
- **Lightweight:** Focused purely on mathematical computation without bloat.

```js
import { createContext } from '@mathflowjs/mathflow';

const ctx = createContext({ preferences: { angles: 'deg' } });

ctx.solve('x = 5');
ctx.solve('2x^3 + sqrt(25)');
// {
//   value: 255,
//   solution: [
//     '2 * 5 ^ 3 + sqrt(25)',
//     '2 * 125 + 5',
//     '250 + 5',
//     '255'
//   ]
// }
```

Every value is a plain number, so a data set is written variadically:
`mean(1, 2, 3)`, not `mean([1, 2, 3])`. See [TODO.md](./TODO.md) for the full
function list and for what is deliberately out of scope.

## Use Cases

- Formula calculators and mathematical tools.
- Educational applications for learning mathematics.
- Basic scientific computing interfaces.
- Anywhere you need to evaluate user-input mathematical expressions safely.

## Documentation

To get started with Mathflow, read the [documentation here](https://mathflow.js.org).

## Contributing

Contributions are welcome to make Mathflow even better! Feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](https://github.com/mathflowjs/mathflow/blob/master/LICENSE.md)

Copyright &copy; 2024-present, [Henry Hale](https://github.com/henryhale)
