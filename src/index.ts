import { DEFAULT_VALUE } from './global';
import { Scope, interpret } from './interpreter';
import { tokenize } from './lexer';
import { parse } from './parser';

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

type Result = {
    value: number;
    scope: Scope;
    solution: string[];
};

type Term = {
    result: string;
    expr: string;
};

function generateSolution(raw: string[]) {
    // console.log('raw:', raw);

    if (!raw.includes('#1') || raw.length < 2) {
        return raw.filter((t, i) => {
            return t.startsWith('(') || i === raw.length - 1;
        });
    }

    const map: { [k: string]: Term } = {};

    for (const [i, t] of raw.entries()) {
        if (t.startsWith('#')) {
            map[t] = {
                result: raw[i - 1],
                expr: raw[i - 2]?.startsWith('#') ? '' : raw[i - 2]
            };
        }
    }

    // console.log(map);

    const solution: string[] = [];

    function step(str: string, box: string[]) {
        let tmp = str;
        if (str) {
            tmp = str.replaceAll(/#\d/g, (m) => map[m]?.result || m);
            box.unshift(tmp);
            str = str.replaceAll(/#\d/g, (m) => map[m]?.expr || m);
            if (!str.includes('#')) {
                box.unshift(str);
            }
        }
        if (str.includes('#')) {
            step(str, box);
        }
    }

    step(raw.at(-2) || '', solution);

    solution.push(raw.at(-1) as string);

    // console.log("sln:", solution);

    return solution.map((t) => {
        return t.replaceAll('((', '(').replaceAll('))', ')');
    });
}

/**
 * Evaluate a set of statements in a script
 */
export function evaluate(code: string): Result {
    // create new scope
    const scope: Scope = {
        variables: {}
    };

    // initiate solution array
    const solution: string[] = [];

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
            if (!value || value.startsWith('#')) {
                return false;
            }
            const matches = value
                .replaceAll(' ', '')
                .match(/^([A-Za-z]\d?)=(.+)$/);
            if (matches) {
                scope.variables[matches[1]] = execute(
                    matches[2],
                    scope,
                    // disabling solutions from variable declarations
                    []
                );
                return false;
            }
            return true;
        });

    let result: number = DEFAULT_VALUE;

    for (const stmt of statements) {
        result = execute(stmt, scope, solution);
    }

    return {
        value: result,
        scope,
        solution: generateSolution(solution)
    };
}
