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
        solution: string[];
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
    // Output: { value: 3, scope: { variables: { a: 1, b: 2, c: 3 } }, solution: ['3'] }
    ```

- **See also:** [Guide - Getting Started](../guide/getting-started.md) or [Guide - Syntax](../guide/basics.md) for details.

## config

Configure the behaviour of the compiler

- **Type**

    ```ts
    type Config = {
        fractionDigits: number;
    };
    ```

- **Details**
    
    - `config.fractionDigits` sets the number of digits after the floating point.
    
- **Example**
  
    ```ts
    import { config, evaluate } from 'mathflow';

    config.fractionDigits = 3;

    console.log(
        evaluate(`1/6`).value
    );
    //Output: 0.167
    ```