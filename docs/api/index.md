# API Reference

## evaluate()

Evaluate a source code written using MathFlow syntax

- **Type**

    ```ts
    type Scope = {
        variables: Record<string, number>;
    };

    type Result = {
        value: number;
        scope: Scope;
    };

    declare function evaluate(code: string): Result;
    ```

- **Details**

    It takes one argument that must be a string containing MathFlow expressions.

- **Example**

    Adding two numbers: `1` and `2`

    ```ts
    import { evaluate } from 'mathflow';

    const script = `
    # declare variables
    a = 1
    b = 2
    # compute sum
    c = a + b
    # return value
    c
    `;

    const result = evaluate(script);

    console.log(result);
    // Output: { value: 3, scope: { variables: { a: 1, b: 2, c: 3 } } }
    ```

- **See also:** [Guide - Getting Started](../guide/getting-started.md) or [Guide - Syntax](../guide/basics.md) for details.
