# Configuration

## fractionDigits

You can change the number of digits after the floating point to any
number between `0` and `20` using [config.fractionDigits](../api/index.md#config).

**Example**: Set `3` decimal places.

```ts
import { config, evaluate } from 'mathflow';

config.fractionDigits = 3;

console.log(
    evaluate(`1/6`)
);

// Output: { value: 0.1667, scope: { variables: {} }, solution: [ '(1 / 6)', '0.1667' ]}
```