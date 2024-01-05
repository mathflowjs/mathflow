# Introduction

:wave: Hello World!

You're reading the official documentation for [MathFlow](https://github.com/henryhale/mathflow).

## What is MathFlow?

**MathFlow** is a lightweight and expressive scripting language designed for mathematical expressions and calculations. It provides a simple and intuitive syntax for performing mathematical operations, including support for standard arithmetic, functions like sin, cos, tan, and other functions.

## What MathFlow is not?

::: warning
- MathFlow is not a fully-fledged scripting language. This means that it can not be used to build applications by itself.
:::

## Main Objectives

The main goals of this project include _expressiveness, focus, and simplicity_.
This implies that the development of this project tends in the direction of providing a better and mathematics-centric usecase.

## How it Works

This section describes how MathFlow is able to work.

This library [API](../api/index.md) exposes the `evaluate` function that takes the MathFlow code and returns a result. Below are the stages the source code undergoes to produce the result;

-   A global scope that holds all variables is created
-   The source code is then split into individual statements. This process involves;
    -   Trimming whitespaces
    -   Expanding composite terms like `2x` into `2*x`
    -   Varible declarations are extracted, their assigned value or expression executed and stored in the global scope variables dictionary
    -   Empty lines or statements are ignored
-   Every statement in the generated list of statements is executed independently. This stage involves the followings;
    -   The statement is tokenized to generate a list of identified tokens
    -   The tokens are then parsed into an Abstract Syntax Tree (AST) basing on the order of operations and precedence of the operators used.
    -   The tree is then interpreted by running through the every node identifying the node type and applying the corresponding operation or computation.
    -   The output of the interpreter is a numerical value.
-   The resultant value of the last statement is returned with the final state of the global scope.