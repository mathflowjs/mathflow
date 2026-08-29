import { NODE, type INode } from '../parser';
import { isBinaryOperator, isAlpha, SYMBOL } from '../lexer/tokens';

type ISolutionConfig = {
    id: number;
    parts: string[];
};

export type ISolution = {
    readonly steps: string[];
    readonly id: number;
};

const store = new WeakMap<ISolution, ISolutionConfig>();

export function advance(solution: ISolution) {
    if (!store.has(solution)) return;
    const c = store.get(solution)!;
    c.parts.push(`#${++c.id}`);
}

export function pushValue(solution: ISolution, value: string | number) {
    if (!store.has(solution)) return;
    const c = store.get(solution)!;
    c.parts.push(value.toString());
}

export function createSolutionStack() {
    const c: ISolutionConfig = {
        id: 0,
        parts: []
    };

    const s = {
        get steps() {
            return buildSolution(c.parts);
        },
        get id() {
            return c.id;
        }
    };

    store.set(s, c);

    return s;
}

type IMapTerm = {
    [k: string]: {
        result: string;
        expr: string;
    };
};

export function buildSolution(raw: string[]): string[] {
    // console.log('raw:', raw);

    if (!raw.includes('#1') || raw.length < 2) {
        return raw
            .filter((t, i) => {
                return t.startsWith('(') || i === raw.length - 1;
            })
            .map((step) => removeExtraParen(step));
    }

    const map: IMapTerm = {};
    let expr: string;
    let hasExpression: boolean;

    for (const [i, t] of raw.entries()) {
        if (t.startsWith('#')) {
            expr = raw[i - 2] || '';
            hasExpression =
                !expr.startsWith('#') &&
                [...expr].some((v) => isBinaryOperator(v) || isAlpha(v));
            map[t] = {
                result: raw[i - 1],
                expr: hasExpression ? expr : ''
            };
        }
    }

    // console.log(map);

    const solution: string[] = [];

    function step(str: string, box: string[]) {
        if (str) {
            const tmp = str.replaceAll(/#\d+/g, (m) => map[m]?.result || '');
            str = str.replaceAll(/#\d+/g, (m) => {
                return map[m]?.expr || map[m]?.result || '';
            });
            if (tmp !== str) {
                box.unshift(tmp);
            }
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

    // console.log('sln:', solution);

    return solution.map((step) => removeExtraParen(step));
}

function removeExtraParen(t: string): string {
    t = t.replace(/\(\((.*)\)\)/g, (m, x) => {
        return x.includes('(') ? m : m.slice(1, -1);
    });
    return t.startsWith('(') ? t.slice(1, -1) : t;
}

/**
 * Operator precedence, used to decide where parentheses are required.
 * Unary sits between `* /` and `^`: `-2^2` is `-(2^2)`, but `-2*3` is `(-2)*3`.
 */
const PRECEDENCE: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 4
};

const UNARY = 3;
const ATOM = 5;

function precedence(node: INode): number {
    if (node.type === NODE.BINARY) return PRECEDENCE[node.value] ?? ATOM;
    if (node.type === NODE.UNARY) return UNARY;
    return ATOM;
}

/**
 * A reduced literal can hold a negative value; `2 - -7` is valid but reads
 * badly, and `-7 ^ 2` would parse back as `-(7 ^ 2)`.
 */
function isNegative(node: INode): boolean {
    return node.type === NODE.LITERAL && node.value.startsWith('-');
}

/**
 * Render an operand, parenthesizing it only when precedence or associativity
 * demands it - `^` is right-associative, every other operator is left.
 */
function operand(
    node: INode,
    parent: number,
    isRight = false,
    rightAssoc = false
): string {
    const child = precedence(node);

    const parens =
        child < parent ||
        (child === parent && isRight !== rightAssoc) ||
        (isNegative(node) && (isRight || parent >= UNARY));

    const text = stringify(node);

    return parens ? `(${text})` : text;
}

/**
 * Render an AST node as the mathematical notation it came from
 */
export function stringify(node: INode): string {
    switch (node.type) {
        case NODE.UNARY:
            return node.value + operand(node.right!, UNARY);

        case NODE.BINARY: {
            const parent = PRECEDENCE[node.value] ?? ATOM;
            const rightAssoc = node.value === SYMBOL.POW;

            return [
                operand(node.left!, parent, false, rightAssoc),
                node.value,
                operand(node.right!, parent, true, rightAssoc)
            ].join(' ');
        }

        case NODE.CALL:
            return `${node.value}(${node.arguments!.map(stringify).join(', ')})`;

        case NODE.ASSIGNMENT:
            return `${node.left!.value} = ${stringify(node.right!)}`;

        default:
            return node.value;
    }
}
