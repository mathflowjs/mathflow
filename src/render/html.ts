import { isBinaryOperator, SYMBOL, type IToken, TOKEN } from '../lexer/tokens';

export type IHTMLRenderOptions = {
    classPrefix: string;
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
        classPrefix: options.classPrefix || 'mf',
        colorScheme: options.colorScheme || 'none',
        includeDebugInfo: options.includeDebugInfo || false,
        ...options
    };

    const getTokenClass = (token: IToken) => {
        const tokenClass = typeClasses[token.type] || 'unknown';
        return `${config.classPrefix}-token ${config.classPrefix}-${tokenClass}`;
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
        css: generateHTMLStyles(config.classPrefix),
        html: `<div class="${config.classPrefix}-expression ${config.classPrefix}-${config.colorScheme}" data-scheme="${config.colorScheme}">${htmlTokens.join('').replace(/<br>$/, '')}</div>`
    };
}

const generateHTMLStyles = (prefix: string) => {
    return `
        .${prefix}-expression.${prefix}-auto,
        .${prefix}-expression.${prefix}-light {
            --${prefix}-fg: #111827;
            --${prefix}-bg: #f9fafb;
            --${prefix}-border: #e5e7eb;

            --${prefix}-number: #000000;
            --${prefix}-identifier: #333333;
            --${prefix}-operator: #666666;
            --${prefix}-assignment: #000000;
            --${prefix}-paren: #888888;
            --${prefix}-function: #222222;
            --${prefix}-comma: #aaaaaa;
        }

        .${prefix}-expression.${prefix}-dark {
            --${prefix}-fg: #f3f4f6;
            --${prefix}-bg: #1f2937;
            --${prefix}-border: #374151;

            --${prefix}-number: #ffffff;
            --${prefix}-identifier: #cccccc;
            --${prefix}-operator: #999999;
            --${prefix}-assignment: #ffffff;
            --${prefix}-paren: #777777;
            --${prefix}-function: #dddddd;
            --${prefix}-comma: #555555;
        }

        @media (prefers-color-scheme: dark) {
            .${prefix}-expression.${prefix}-auto {
                --${prefix}-fg: #f3f4f6;
                --${prefix}-bg: #1f2937;
                --${prefix}-border: #374151;

                --${prefix}-number: #ffffff;
                --${prefix}-identifier: #cccccc;
                --${prefix}-operator: #999999;
                --${prefix}-assignment: #ffffff;
                --${prefix}-paren: #777777;
                --${prefix}-function: #dddddd;
                --${prefix}-comma: #555555;
            }
        }

        .${prefix}-expression {
            font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Courier New', monospace;
            font-size: 16px;
            line-height: 1.6;
            padding: 12px 16px;
            border-radius: 6px;
            background: var(--${prefix}-bg, transparent);
            border: 1px solid var(--${prefix}-border);
            color: var(--${prefix}-fg, currentColor);
            overflow: auto;
        }
      
        .${prefix}-token {
            margin: 0;
            transition: background-color 0.2s ease;
        }
      
        .${prefix}-token:hover {
            background-color: var(--${prefix}-border, transparent);
            border-radius: 2px;
            cursor: default;
        }
      
        .${prefix}-number {
            color: var(--${prefix}-number, currentColor);
        }
        .${prefix}-identifier {
            color: var(--${prefix}-identifier, currentColor);
            font-style: italic;
        }
        .${prefix}-operator {
            color: var(--${prefix}-operator, currentColor);
            font-weight: semibold;
        }
        .${prefix}-assignment {
            color: var(--${prefix}-assignment, currentColor);
            font-weight: semibold;
        }
        .${prefix}-paren {
            color: var(--${prefix}-paren, currentColor);
            font-weight: semibold;
        }
        .${prefix}-function {
            color: var(--${prefix}-function, currentColor);
            font-weight: medium;
        }
        .${prefix}-comma {
            color: var(--${prefix}-comma, currentColor);
        }
      
        .${prefix}-position {
            font-size: 0.7em;
            color: var(--${prefix}-fg, currentColor);
            margin-left: 4px;
            vertical-align: super;
        }
      
        sup.${prefix}-token {
            font-size: 0.8em;
            vertical-align: super;
        }
    `;
};
