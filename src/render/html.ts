import { isBinaryOperator, SYMBOL, type Token, TOKEN } from "../lexer/tokens";

export type HTMLRenderOptions = {
    classPrefix: string
    colorScheme: 'auto' | 'light' | 'dark'
    includeDebugInfo: boolean
}

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
}

function formatTokenValue(token: Token): string {
    let value = characterMap[token.value] || token.value
    if (isBinaryOperator(token.value) || token.type === TOKEN.ASSIGNMENT) {
        value = `&nbsp;${value}&nbsp;`
    } else if (token.type === TOKEN.COMMA) {
        value = `${value}&nbsp;`
    }
    return value
};

// Generate HTML representation of the expression from tokens 
export function renderTokensAsHTML(tokens: Token[], options: Partial<HTMLRenderOptions> = {}) {
    const config: HTMLRenderOptions = {
        classPrefix: options.classPrefix || 'mf',
        colorScheme: options.colorScheme || 'auto',
        includeDebugInfo: options.includeDebugInfo || false,
        ...options
    };

    const getTokenClass = (token: Token) => {
        const tokenClass = typeClasses[token.type] || 'unknown'
        return `${config.classPrefix}-token ${config.classPrefix}-${tokenClass}`;
    };

    const renderToken = (token: Token, index: number) => {
        const className = getTokenClass(token);
        const value = formatTokenValue(token);
        const debugInfo = config.includeDebugInfo ?
            ` data-position="${token.position}" data-line="${token.line}" data-column="${token.column}"` : '';

        // handle special cases
        if (token.type === TOKEN.NEWLINE) {
            return value; // just return <br> for newlines
        }

        // handle exponentiation with superscript
        if (token.type === TOKEN.OPERATOR && token.value === SYMBOL.POW) {
            const nextToken = tokens[index + 1];
            if (nextToken && nextToken.type === TOKEN.NUMBER) {
                // skip this token, let the number be rendered as superscript by the next iteration
                return '';
            }
        }

        // handle superscript numbers after exponentiation
        if (token.type === TOKEN.NUMBER && index > 0) {
            const prevToken = tokens[index - 1];
            if (prevToken && prevToken.type === TOKEN.OPERATOR &&
                prevToken.value === SYMBOL.POW) {
                return `<sup class="${className}"${debugInfo}>${value}</sup>`;
            }
        }

        return `<span class="${className}"${debugInfo}>${value}</span>`;
    };

    const htmlTokens = tokens.map(renderToken).filter(token => token !== '');

    const styles = generateHTMLStyles(config.classPrefix);

    return `
      <div class="${config.classPrefix}-expression ${config.classPrefix}-${config.colorScheme}" data-scheme="${config.colorScheme}">
        <style>${styles}</style>
        ${htmlTokens.join('')}
      </div>
    `;
};

const generateHTMLStyles = (prefix: string) => {
    return `
        .${prefix}-expression,
        .${prefix}-expression.${prefix}-light {
            --fg: #111827;
            --bg: #f9fafb;
            --border: #e5e7eb;

            --number: #22c55e;
            --identifier: #3b82f6;
            --operator: #ef4444;
            --assignment: #f59e0b;
            --paren: #8b5cf6;
            --function: #ec4899;
            --comma: #64748b;
        }

        .${prefix}-expression.${prefix}-dark {
            --fg: #f3f4f6;
            --bg: #1f2937;
            --border: #374151;

            --number: #60a5fa;
            --identifier: #a78bfa;
            --operator: #f87171;
            --assignment: #34d399;
            --paren: #9ca3af;
            --function: #fdba74;
            --comma: #9ca3af;
        }

        @media (prefers-color-scheme: dark) {
            .${prefix}-expression.${prefix}-auto {
                --fg: #f3f4f6;
                --bg: #1f2937;
                --border: #374151;

                --number: #60a5fa;
                --identifier: #a78bfa;
                --operator: #f87171;
                --assignment: #34d399;
                --paren: #9ca3af;
                --function: #fdba74;
                --comma: #9ca3af;
            }
        }

        .${prefix}-expression {
            font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Courier New', monospace;
            font-size: 16px;
            line-height: 1.6;
            padding: 12px 16px;
            border-radius: 6px;
            background: var(--bg);
            border: 1px solid var(--border);
            color: var(--fg);
        }
      
        .${prefix}-token {
            margin: 0 1px;
            transition: background-color 0.2s ease;
        }
      
        .${prefix}-token:hover {
            background-color: var(--border);
            border-radius: 2px;
        }
      
        .${prefix}-number {
            color: var(--${prefix}-number);
            font-weight: 600;
        }
        .${prefix}-identifier {
            color: var(--${prefix}-identifier);
            font-style: italic;
        }
        .${prefix}-operator {
            color: var(--${prefix}-operator);
            font-weight: bold;
        }
        .${prefix}-assignment {
            color: var(--${prefix}-assignment);
            font-weight: bold;
        }
        .${prefix}-paren {
            color: var(--${prefix}-paren);
            font-weight: bold;
            font-size: 1.1em;
        }
        .${prefix}-function {
            color: var(--${prefix}-function);
            font-weight: 600;
        }
        .${prefix}-comma {
            color: var(--${prefix}-comma);
        }
      
        .${prefix}-position {
            font-size: 0.7em;
            color: var(--fg);
            margin-left: 4px;
            vertical-align: super;
        }
      
        sup.${prefix}-token {
            font-size: 0.8em;
            vertical-align: super;
        }
    `;
};
