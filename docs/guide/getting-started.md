# Getting Started

## Preresquities

Before getting started, make sure that you have the following installed on your machine;

-   [Node.js](https://nodejs.org)
-   [npm](https://npmjs.org)

## Installation

You can install MathScript via npm:

```sh:no-line-numbers
npm install mathscript
# pnpm add mathscript
```

## Usage

```js
import { evaluate } from 'mathscript';

// Example script
const script = `
# Hello MathScript! 
1 * 3 - 2 + 2sin(30)
`;

const result = evaluate(script);

console.log(result);
// Output: { value: 2, scope: { variables: {} } }
```

To learn the MathScript syntax, head over to the [syntax](syntax) section for details.

For more examples, check the [examples](#examples) section.
