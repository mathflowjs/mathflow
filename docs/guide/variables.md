# Variables

A variable is a global area that stores a value.

**Rules for namig variables**

-   Must start with a letter, uppercase or lowercase e.g. `x`, `A`
-   Case sensitive: `x` is different from `X`
-   Can contain only one number after a letter: `x1` not `x12`

**How to declare a variable?**

Declare variables the same way you would do on paper.

```sh
x = 1
```

Variables can be declared with expressions. Each declaraion or statement must exist on a newline.

```sh
x = 1 + 2
```

On declaration, variables can reference others in an expression.

```sh
x = 1
y = x + 1
z = x / (2 * y)
```

Multicharacter variable identifiers start with a letter followed by a single number.

```sh
x1 = 1
x2 = 2
x3 = x1 + x2
```
