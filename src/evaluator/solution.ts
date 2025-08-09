import { isBinaryOperator, isAlpha } from '../lexer/tokens';

export type Solution = ReturnType<typeof createSolutionStack>;

export function createSolutionStack() {
    // tokenize results from evaluated expressions
    let id: number = 0;

    const parts: string[] = [];

    function advance() {
        parts.push(`#${++id}`);
    }

    function push(value: string | number) {
        parts.push(value.toString());
    }

    function reset() {
        id = 0;
    }

    return {
        get steps() {
            return buildSolution(parts);
        },
        get id() {
            return id;
        },
        reset,
        push,
        advance
    };
}

type MapTerm = {
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

    const map: MapTerm = {};
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
        let tmp = str;
        if (str) {
            tmp = str.replaceAll(/#\d+/g, (m) => map[m]?.result || '');
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
