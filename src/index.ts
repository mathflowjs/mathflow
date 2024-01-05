import { DEFAULT_VALUE } from './global';
import { Scope, interpret } from './interpreter';
import { tokenize } from './lexer';
import { parse } from './parser';

/**
 * Computes the value of an expression
 */
function execute(expr: string, scope: Scope): number {
    // console.log(expr);
    const tokens = tokenize(expr);
    // console.log("tokens", tokens);
    const ast = parse(tokens);
    // console.log("ast", ast);
    const result = interpret(ast, scope);
    // console.log("result", result);
    return result;
}

type Result = {
    value: number;
    scope: Scope;
};

/**
 * Evaluate a set of statements in a script
 */
export function evaluate(code: string): Result {
    const scope: Scope = {
        variables: {}
    };

    const statements = code
        .trim()
        .replace(/(\d)([a-z]|\()/gi, (_, num, char) => {
            return num + '*' + char;
        })
        .split('\n')
        .filter((value) => {
            value = value.trim();
            if (!value || value.startsWith('#')) {
                return false;
            }
            const matches = value
                .replaceAll(' ', '')
                .match(/^([A-Za-z]\d?)=(.+)$/);
            if (matches) {
                scope.variables[matches[1]] = execute(matches[2], scope);
                return false;
            }
            return true;
        });

    let result: number = DEFAULT_VALUE;
    for (const stmt of statements) {
        result = execute(stmt, scope);
    }

    return { value: result, scope };
}