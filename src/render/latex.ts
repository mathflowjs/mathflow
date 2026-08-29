import { TOKEN, type IToken } from '../lexer/tokens';

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
    abs: '\\left|',
    floor: '\\lfloor',
    ceil: '\\lceil',
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

// functions written as a delimiter pair rather than a name and parentheses
const delimiters: Record<string, [string, string]> = {
    sqrt: ['\\sqrt{', '}'],
    abs: ['\\left|', '\\right|']
};

// read up to the paren that closes the one already consumed
function collectGroup(
    tokens: IToken[],
    start: number,
    mode: ILaTeXRenderOptions['mode']
): { content: string; end: number } {
    const content = [];
    let depth = 1;
    let i = start;

    while (i < tokens.length && depth > 0) {
        if (tokens[i].type === TOKEN.LPAREN) depth++;
        if (tokens[i].type === TOKEN.RPAREN) depth--;

        if (depth > 0) content.push(formatTokenValue(tokens[i], mode));
        i++;
    }

    return { content: content.join(''), end: i };
}

function handleSpecialCases(
    tokens: IToken[],
    mode: ILaTeXRenderOptions['mode']
): string {
    const result = [];
    let i = 0;

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

        // Handle fractions (division)
        if (token.type === TOKEN.OPERATOR && token.value === '/') {
            // Look for simple fraction pattern: number/number or identifier/identifier
            if (
                prevToken &&
                nextToken &&
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
