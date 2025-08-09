import { isBinaryOperator, SYMBOL, type Token, TOKEN } from '../lexer/tokens';

export type HTMLRenderOptions = {
    classPrefix: string;
    colorScheme: 'auto' | 'light' | 'dark';
    includeDebugInfo: boolean;
};

const characterMap: Record<string, string> = {
    '^': '', // will be handled specially for superscript
    '-': '&minus;',
    '*': '&times;',
    '/': '&divide;',
    '=': '&equals;',
    '+': '&plus;',
    '\n': '<br>',
    pi: '&pi;',
    sqrt: '&sqrt;',
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

function formatTokenValue(token: Token): string {
    let value = characterMap[token.value] || token.value;
    if (isBinaryOperator(token.value) || token.type === TOKEN.ASSIGNMENT) {
        value = `&nbsp;${value}&nbsp;`;
    } else if (token.type === TOKEN.COMMA) {
        value = `${value}&nbsp;`;
    }
    return value;
}

// Generate HTML representation of the expression from tokens
export function renderTokensAsHTML(
    tokens: Token[],
    options: Partial<HTMLRenderOptions> = {}
) {
    const config: HTMLRenderOptions = {
        classPrefix: options.classPrefix || 'mf',
        colorScheme: options.colorScheme || 'auto',
        includeDebugInfo: options.includeDebugInfo || false,
        ...options
    };

    const getTokenClass = (token: Token) => {
        const tokenClass = typeClasses[token.type] || 'unknown';
        return `${config.classPrefix}-token ${config.classPrefix}-${tokenClass}`;
    };

    const renderToken = (token: Token, index: number) => {
        const className = getTokenClass(token);
        const value = formatTokenValue(token);
        const debugInfo = config.includeDebugInfo
            ? ` data-position="${token.position}" data-line="${token.line}" data-column="${token.column}"`
            : '';

        // skip EOF or implicit token
        if (token.type === TOKEN.EOF || token.implicit) {
            return ''
        }

        // handle special cases
        if (token.type === TOKEN.NEWLINE) {
            return value; // just return <br> for newlines
        }

        // handle exponentiation with superscript
        if (token.type === TOKEN.OPERATOR && token.value === SYMBOL.POW) {
            const nextToken = tokens[index + 1];
            if (nextToken && (nextToken.type === TOKEN.NUMBER || nextToken.type === TOKEN.IDENTIFIER)) {
                // skip this token, let the number/identifier be rendered as superscript by the next iteration
                return '';
            }
        }

        // handle superscript numbers after exponentiation
        if (index > 0 && (token.type === TOKEN.NUMBER || token.type === TOKEN.IDENTIFIER)) {
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

    const styles = generateHTMLStyles(config.classPrefix);

    return `
      <div class="${config.classPrefix}-expression ${config.classPrefix}-${config.colorScheme}" data-scheme="${config.colorScheme}">
        <style>${styles}</style>
        ${htmlTokens.join('')}
      </div>
    `;
}

const generateHTMLStyles = (prefix: string) => {
    return `
        .${prefix}-expression.${prefix}-light {
            --${prefix}-fg: #111827;
            --${prefix}-bg: #f9fafb;
            --${prefix}-border: #e5e7eb;

            --${prefix}-number: #22c55e;
            --${prefix}-identifier: #3b82f6;
            --${prefix}-operator: #ef4444;
            --${prefix}-assignment: #f59e0b;
            --${prefix}-paren: #8b5cf6;
            --${prefix}-function: #ec4899;
            --${prefix}-comma: #64748b;
        }

        .${prefix}-expression.${prefix}-dark {
            --${prefix}-fg: #f3f4f6;
            --${prefix}-bg: #1f2937;
            --${prefix}-border: #374151;

            --${prefix}-number: #60a5fa;
            --${prefix}-identifier: #a78bfa;
            --${prefix}-operator: #f87171;
            --${prefix}-assignment: #34d399;
            --${prefix}-paren: #9ca3af;
            --${prefix}-function: #fdba74;
            --${prefix}-comma: #9ca3af;
        }

        @media (prefers-color-scheme: dark) {
            .${prefix}-expression.${prefix}-auto {
                --${prefix}-fg: #f3f4f6;
                --${prefix}-bg: #1f2937;
                --${prefix}-border: #374151;

                --${prefix}-number: #60a5fa;
                --${prefix}-identifier: #a78bfa;
                --${prefix}-operator: #f87171;
                --${prefix}-assignment: #34d399;
                --${prefix}-paren: #9ca3af;
                --${prefix}-function: #fdba74;
                --${prefix}-comma: #9ca3af;
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
