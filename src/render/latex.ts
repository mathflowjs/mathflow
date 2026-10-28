import { isUnaryOperator, SYMBOL, TOKEN, type IToken } from '../lexer/tokens';

export type ILaTeXRenderOptions = {
    mode: 'inline' | 'display' | 'align';
};

const characterMap: Record<string, string> = {
    '=': ' = ',
    ',': ', ',
    '(': '\\left(',
    ')': '\\right)',
    '*': ' \\cdot ',
    '/': ' \\div ',
    asin: '\\arcsin',
    acos: '\\arccos',
    atan: '\\arctan',
    exp: '\\exp',
    sqrt: '\\sqrt',
    min: '\\min',
    max: '\\max',
    log: '\\log',
    ln: '\\ln',
    Infinity: '\\infty',
    pi: '\\pi'
};

function formatTokenValue(
    token: IToken,
    mode: ILaTeXRenderOptions['mode']
): string {
    if (characterMap[token.value]) return characterMap[token.value];
    if (token.type === TOKEN.FUNCTION) {
        return `\\text{${token.value}}`;
    }
    if (token.type === TOKEN.NEWLINE) {
        return mode === 'align' ? ' \\\\\n' : ' \\\\ ';
    }
    return token.value;
}

// functions written as a delimiter pair rather than a name and parentheses -
// each entry has to close what it opens, or the output will not parse
const delimiters: Record<string, [string, string]> = {
    sqrt: ['\\sqrt{', '}'],
    abs: ['\\left|', '\\right|'],
    ceil: ['\\left\\lceil ', '\\right\\rceil'],
    floor: ['\\left\\lfloor ', '\\right\\rfloor']
};

// read up to the paren that closes the one already consumed, rendering what is
// inside through the same rules - a group is an expression like any other, so
// a superscript or a nested call within it has to be handled, not copied out
function collectGroup(
    tokens: IToken[],
    start: number,
    mode: ILaTeXRenderOptions['mode']
): { content: string; end: number } {
    let depth = 1;
    let i = start;

    while (i < tokens.length && depth > 0) {
        if (tokens[i].type === TOKEN.LPAREN) depth++;
        if (tokens[i].type === TOKEN.RPAREN) depth--;
        i++;
    }

    // exclude the closing paren, unless the group was never closed
    const end = depth === 0 ? i - 1 : i;

    return {
        content: handleSpecialCases(tokens.slice(start, end), mode),
        end: i
    };
}

/**
 * Read one operand of `^`.
 *
 * A superscript takes a single token or a braced group, so `2^(5-1)` has to
 * come out as `2^{5-1}` - emitting `^` and walking on gives `2^\left(5-1\right)`,
 * which is a parse error rather than a wrong-looking result.
 */
function readExponent(
    tokens: IToken[],
    start: number,
    mode: ILaTeXRenderOptions['mode']
): { content: string; end: number } {
    let content = '';
    let i = start;

    // a sign belongs to the exponent, as in `2^-1`
    while (
        tokens[i] &&
        tokens[i].type === TOKEN.OPERATOR &&
        isUnaryOperator(tokens[i].value)
    ) {
        content += tokens[i].value;
        i++;
    }

    const token = tokens[i];

    if (!token) return { content, end: i };

    if (token.type === TOKEN.FUNCTION && tokens[i + 1]?.type === TOKEN.LPAREN) {
        const pair = delimiters[token.value];
        const group = collectGroup(tokens, i + 2, mode);

        content += pair
            ? pair[0] + group.content + pair[1]
            : `${formatTokenValue(token, mode)}\\left(${group.content}\\right)`;
        i = group.end;
    } else if (token.type === TOKEN.LPAREN) {
        // the braces already group it, so the parentheses are redundant
        const group = collectGroup(tokens, i + 1, mode);

        content += group.content;
        i = group.end;
    } else {
        content += formatTokenValue(token, mode);
        i++;
    }

    // `^` is right-associative: 2^3^2 is 2^{3^{2}}
    if (
        tokens[i] &&
        tokens[i].type === TOKEN.OPERATOR &&
        tokens[i].value === SYMBOL.POW
    ) {
        const nested = readExponent(tokens, i + 1, mode);

        content += `^{${nested.content}}`;
        i = nested.end;
    }

    return { content, end: i };
}

function handleSpecialCases(
    tokens: IToken[],
    mode: ILaTeXRenderOptions['mode']
): string {
    const result = [];
    let i = 0;

    // index of the token whose rendering is the last entry in `result`, when
    // that entry is a lone value - only then is it safe to pop as a numerator
    let atom = -1;

    while (i < tokens.length) {
        const token = tokens[i];
        const nextToken = tokens[i + 1];
        const prevToken = tokens[i - 1];

        // skip EOF token
        if (token.type === TOKEN.EOF) {
            break;
        }

        // Handle function calls that are written as a delimiter pair
        if (
            token.type === TOKEN.FUNCTION &&
            nextToken &&
            nextToken.type === TOKEN.LPAREN &&
            token.value in delimiters
        ) {
            const [open, close] = delimiters[token.value];

            // skip the function and its opening paren
            i += 2;

            const group = collectGroup(tokens, i, mode);

            result.push(open + group.content + close);
            i = group.end;

            continue;
        }

        // Handle superscripts, which have to be braced as a single group
        if (token.type === TOKEN.OPERATOR && token.value === SYMBOL.POW) {
            const exponent = readExponent(tokens, i + 1, mode);

            result.push(`^{${exponent.content}}`);
            i = exponent.end;

            continue;
        }

        // Handle fractions (division)
        if (token.type === TOKEN.OPERATOR && token.value === '/') {
            // Look for simple fraction pattern: number/number or identifier/identifier
            if (
                prevToken &&
                nextToken &&
                atom === i - 1 &&
                (prevToken.type === TOKEN.NUMBER ||
                    prevToken.type === TOKEN.IDENTIFIER) &&
                (nextToken.type === TOKEN.NUMBER ||
                    nextToken.type === TOKEN.IDENTIFIER)
            ) {
                // Remove the previous token from result and create fraction
                const numerator = result.pop();
                const denominator = formatTokenValue(nextToken, mode);

                result.push(`\\frac{${numerator}}{${denominator}}`);
                i += 2; // Skip division operator and next token
                continue;
            }
        }

        if (token.type === TOKEN.NUMBER || token.type === TOKEN.IDENTIFIER) {
            atom = i;
        }

        result.push(formatTokenValue(token, mode));

        i++;
    }

    return result.join('');
}

/**
 * Generate LaTeX representation of the expression from tokens
 * - _experimental_
 */
export function renderTokensAsLaTeX(
    tokens: IToken[],
    options: Partial<ILaTeXRenderOptions> = {}
) {
    const config = {
        mode: options.mode || 'inline'
    };

    const latexContent = handleSpecialCases(tokens, config.mode);

    // Wrap in appropriate math delimiters
    const mathDelimiters = {
        inline: ['$', '$'],
        display: ['$$', '$$'],
        align: ['\\begin{align}\n', '\n\\end{align}']
    };

    const [openDelim, closeDelim] =
        mathDelimiters[config.mode] || mathDelimiters.inline;

    return openDelim + latexContent + closeDelim;
}
