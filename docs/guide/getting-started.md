# Getting Started

## Preresquities

Before getting started, make sure that you have the following installed on your machine;

-   [Node.js](https://nodejs.org)
-   [npm](https://npmjs.org)

## Installation

You can install MathFlow via npm:

```sh:no-line-numbers
npm install mathflow
# pnpm add mathflow
```

## Usage

```js
import { evaluate } from 'mathflow';

// Example script
const script = `
# Hello MathFlow! 
1 * 3 - 2 + 2sin(30)
`;

const result = evaluate(script);

console.log(result);
// Output: { value: 2, scope: { variables: {} } }
```

To learn the MathFlow syntax, head over to the [syntax](./basics.md) section for details.

For more examples, check the [examples](./scripts.md) section.
