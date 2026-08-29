import { isBinaryOperator, SYMBOL, type IToken, TOKEN } from '../lexer/tokens';

export type IHTMLRenderOptions = {
    colorScheme: 'none' | 'auto' | 'light' | 'dark';
    includeDebugInfo: boolean;
};

export type IHTMLRenderResult = {
    html: string;
    css: string;
};

const characterMap: Record<string, string> = {
    '^': '', // will be handled specially for superscript
    '-': '&minus;',
    '*': '&middot;',
    '/': '&divide;',
    '=': '&equals;',
    '+': '&plus;',
    '\n': '<br>',
    pi: '&pi;',
    sqrt: '&Sqrt;',
    Infinity: '&infin;'
};

const typeClasses: Record<string, string> = {
    [TOKEN.NUMBER]: 'number',
    [TOKEN.IDENTIFIER]: 'identifier',
    [TOKEN.OPERATOR]: 'operator',
    [TOKEN.ASSIGNMENT]: 'assignment',
    [TOKEN.LPAREN]: 'paren',
    [TOKEN.RPAREN]: 'paren',
    [TOKEN.FUNCTION]: 'function',
    [TOKEN.COMMA]: 'comma',
    [TOKEN.NEWLINE]: 'newline'
};

function formatTokenValue(token: IToken): string {
    let value = characterMap[token.value] || token.value;
    if (isBinaryOperator(token.value) || token.type === TOKEN.ASSIGNMENT) {
        value = `&nbsp;${value}&nbsp;`;
    } else if (token.type === TOKEN.COMMA) {
        value = `${value}&nbsp;`;
    }
    return value;
}

/**
 * Generate HTML representation of the expression from tokens
 * - _experimental_
 */
export function renderTokensAsHTML(
    tokens: IToken[],
    options: Partial<IHTMLRenderOptions> = {}
): IHTMLRenderResult {
    const config: IHTMLRenderOptions = {
        colorScheme: options.colorScheme || 'none',
        includeDebugInfo: options.includeDebugInfo || false
    };

    const getTokenClass = (token: IToken) => {
        return `mf-token mf-${typeClasses[token.type] || 'unknown'}`;
    };

    const renderToken = (token: IToken, index: number) => {
        const className = getTokenClass(token);
        const value = formatTokenValue(token);
        const debugInfo = config.includeDebugInfo
            ? ` data-position="${token.position}" data-line="${token.line}" data-column="${token.column}"`
            : '';

        // skip EOF or implicit token
        if (token.type === TOKEN.EOF || token.implicit) {
            return '';
        }

        // handle special cases
        if (token.type === TOKEN.NEWLINE) {
            return value; // just return <br> for newlines
        }

        // handle exponentiation with superscript
        if (token.type === TOKEN.OPERATOR && token.value === SYMBOL.POW) {
            const nextToken = tokens[index + 1];
            if (
                nextToken &&
                (nextToken.type === TOKEN.NUMBER ||
                    nextToken.type === TOKEN.IDENTIFIER)
            ) {
                // skip this token, let the number/identifier be rendered as superscript by the next iteration
                return '';
            }
        }

        // handle superscript numbers after exponentiation
        if (
            index > 0 &&
            (token.type === TOKEN.NUMBER || token.type === TOKEN.IDENTIFIER)
        ) {
            const prevToken = tokens[index - 1];
            if (
                prevToken &&
                prevToken.type === TOKEN.OPERATOR &&
                prevToken.value === SYMBOL.POW
            ) {
                return `<sup class="${className}"${debugInfo}>${value}</sup>`;
            }
        }

        return `<span class="${className}"${debugInfo}>${value}</span>`;
    };

    const htmlTokens = tokens.map(renderToken).filter((token) => token !== '');

    return {
        css: STYLES,
        html: `<div class="mf-expression mf-${config.colorScheme}" data-scheme="${config.colorScheme}">${htmlTokens.join('').replace(/<br>$/, '')}</div>`
    };
}

const STYLES = `
/* colors only apply to an explicit scheme - \`none\` inherits the page */
.mf-expression.mf-auto {
    color-scheme: light dark;
}
.mf-expression.mf-light {
    color-scheme: light;
}
.mf-expression.mf-dark {
    color-scheme: dark;
}
.mf-expression.mf-auto,
.mf-expression.mf-light,
.mf-expression.mf-dark {
    --mf-fg: light-dark(#111827, #f3f4f6);
    --mf-bg: light-dark(#f9fafb, #1f2937);
    --mf-border: light-dark(#e5e7eb, #374151);

    --mf-number: light-dark(#000000, #ffffff);
    --mf-identifier: light-dark(#333333, #cccccc);
    --mf-operator: light-dark(#666666, #999999);
    --mf-assignment: light-dark(#000000, #ffffff);
    --mf-paren: light-dark(#888888, #777777);
    --mf-function: light-dark(#222222, #dddddd);
    --mf-comma: light-dark(#aaaaaa, #555555);
}

.mf-expression {
    font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Courier New', monospace;
    font-size: 16px;
    line-height: 1.6;
    padding: 12px 16px;
    border-radius: 6px;
    background: var(--mf-bg, transparent);
    border: 1px solid var(--mf-border, transparent);
    color: var(--mf-fg, currentColor);
    overflow: auto;
}

.mf-token {
    margin: 0;
    transition: background-color 0.2s ease;
}

.mf-token:hover {
    background-color: var(--mf-border, transparent);
    border-radius: 2px;
    cursor: default;
}

.mf-number {
    color: var(--mf-number, currentColor);
}
.mf-identifier {
    color: var(--mf-identifier, currentColor);
    font-style: italic;
}
.mf-operator {
    color: var(--mf-operator, currentColor);
    font-weight: semibold;
}
.mf-assignment {
    color: var(--mf-assignment, currentColor);
    font-weight: semibold;
}
.mf-paren {
    color: var(--mf-paren, currentColor);
    font-weight: semibold;
}
.mf-function {
    color: var(--mf-function, currentColor);
    font-weight: medium;
}
.mf-comma {
    color: var(--mf-comma, currentColor);
}

sup.mf-token {
    font-size: 0.8em;
    vertical-align: super;
}
`;
