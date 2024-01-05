# Expressions

Expressions are parts of a statement that may contain a composition of binary operators, brackets and numbers: _floats and integers_.

## Operators

MathFlow currently supports only binary operators, that is, `+`, `-`, `/`, `*`.
Computations follow the arithmetic precedence of each operator.

```sh
1 + 2 * 3;
```

The above expression evaluates to `7` but not `9`.

## Return Values

The result of the last expression in the script is considered to be the _return value_.

The script below results into `5` as the resultant value.

```sh
1.2 + 1.8;
2 + 3;
```

## Terms

MathFlow enables you to write normal mathematical terms.

```sh
x = 3
y = (2x - 1) / (3x + 1)
```

However, the following is not allowed;

```sh
x = 3;
y = 2;
z = xy;
```

To handle that kind of composition, add a binary operator between the variables. Otherwise, it is considered as an identifier or keyword.

```sh
x = 3;
y = 2;
z = x * y;
```
