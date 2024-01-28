import { CONSTANTS, DEFAULT_VALUE, FUNCTIONS } from './global';
import { Scope, interpret } from './interpreter';
import { tokenize } from './lexer';
import { parse } from './parser';
import { generateSolution } from './solution';

/**
 * Computes the value of an expression
 */
function execute(expr: string, scope: Scope, solution: string[]): number {
    // console.log(expr);
    const tokens = tokenize(expr);
    // console.log("tokens", tokens);
    const ast = parse(tokens);
    // console.log("ast", ast);
    const result = interpret(ast, scope, solution, true);
    // console.log("result", result);
    return result;
}

export type Result = {
    value: number;
    scope: Scope;
    solution: string[];
};

/**
 * Evaluate a set of statements in a script
 */
export function evaluate(code: string): Result {
    // create new scope
    const scope: Scope = {
        variables: {}
    };

    // generate individual statements
    const statements = code
        .trim()
        // expand multiplying terms
        .replace(/(\d)([a-z]|\()/gi, (_, num, char) => {
            return num + '*' + char;
        })
        .split('\n')
        .filter((value) => {
            value = value.trim();
            // ignore comments or empty lines
            if (!value || value.startsWith('#')) {
                return false;
            }
            // capture multiple variable declarations on the same line
            const variables = value.replaceAll(' ', '').split(',');
            let matched = false;
            let matches: RegExpMatchArray | null;
            for (const v of variables) {
                matches = v.match(/^([A-Za-z](\d+)?)=(.+)$/);
                if (matches) {
                    if (CONSTANTS[matches[1]] || FUNCTIONS[matches[1]]) {
                        throw new Error(
                            `Identifier '${matches[1]}' is a builtin constant or function`
                        );
                    }
                    scope.variables[matches[1]] = execute(
                        matches[3],
                        scope,
                        // disabling solutions from variable declarations
                        []
                    );
                    matched = true;
                }
            }
            return !matched;
        });

    // resultant value
    let value: number = DEFAULT_VALUE;

    // initiate solution array
    let solution: string[] = [];

    // evaluate all statements keeping track of scope and steps
    for (const stmt of statements) {
        value = execute(stmt, scope, solution);
    }

    // refine the solution
    solution = generateSolution(solution);

    return { value, scope, solution };
}

export { config } from './global';
