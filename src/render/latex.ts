import { TOKEN, Token } from "../lexer/tokens";

export type TEXRenderOptions = {
	mode: 'inline' | 'display' | 'align'
}

const characterMap: Record<string, string> = {
	'=': ' = ',
	',': ', ',
	'*': ' \\cdot ',
	'/': ' \\div ',
	'asin': '\\arcsin',
	'acos': '\\arccos',
	'atan': '\\arctan',
	'abs': '\\left|',
	'floor': '\\lfloor',
	'ceil': '\\lceil',
	'exp': '\\exp',
	'sqrt': '\\sqrt',
	'min': '\\min',
	'max': '\\max',
	'log': '\\log',
	'ln': '\\ln',
	'infinity': '\\infty',
	'pi': '\\pi',
}

function formatTokenValue(token: Token, mode: TEXRenderOptions['mode']): string {
	if (characterMap[token.value]) return characterMap[token.value]
	if (token.type === TOKEN.LPAREN) return '\\left(';
	if (token.type === TOKEN.RPAREN) return '\\right)';
	if (token.type === TOKEN.FUNCTION) {
		return `\\text{${token.value}}`
	}
	if (token.type === TOKEN.NEWLINE) {
		return mode === 'align' ? ' \\\\\n' : ' \\\\ '
	}
	return token.value
}

function handleSpecialCases(tokens: Token[], mode: TEXRenderOptions['mode']): string {
	const result = [];
	let i = 0;

	while (i < tokens.length) {
		const token = tokens[i];
		const nextToken = tokens[i + 1];
		const prevToken = tokens[i - 1];

		// Handle function calls with parentheses
		if (token.type === TOKEN.FUNCTION &&
			nextToken && nextToken.type === TOKEN.LPAREN) {

			if (token.value === 'sqrt') {
				// Handle square root specially
				result.push('\\sqrt{');
				i += 2; // Skip function and opening paren

				// Find matching closing paren and collect arguments
				let parenCount = 1;
				const sqrtContent = [];

				while (i < tokens.length && parenCount > 0) {
					if (tokens[i].type === TOKEN.LPAREN) parenCount++;
					if (tokens[i].type === TOKEN.RPAREN) parenCount--;

					if (parenCount > 0) {
						sqrtContent.push(formatTokenValue(tokens[i], mode));
					}
					i++;
				}

				result.push(sqrtContent.join('') + '}');
				continue;
			}

			if (token.value === 'abs') {
				// Handle absolute value specially
				result.push('\\left|');
				i += 2; // Skip function and opening paren

				// Find matching closing paren
				let parenCount = 1;
				const absContent = [];

				while (i < tokens.length && parenCount > 0) {
					if (tokens[i].type === TOKEN.LPAREN) parenCount++;
					if (tokens[i].type === TOKEN.RPAREN) parenCount--;

					if (parenCount > 0) {
						absContent.push(formatTokenValue(tokens[i], mode));
					}
					i++;
				}

				result.push(absContent.join('') + '\\right|');
				continue;
			}
		}

		// Handle fractions (division)
		if (token.type === TOKEN.OPERATOR && token.value === '/') {
			// Look for simple fraction pattern: number/number or identifier/identifier
			if (prevToken && nextToken &&
				(prevToken.type === TOKEN.NUMBER || prevToken.type === TOKEN.IDENTIFIER) &&
				(nextToken.type === TOKEN.NUMBER || nextToken.type === TOKEN.IDENTIFIER)) {

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
};

// Generate LaTeX representation of the expression from tokens 
export function renderTokensAsLaTeX(tokens: Token[], options: Partial<TEXRenderOptions> = {}) {
	const config = {
		mode: options.mode || 'inline',
	};

	const latexContent = handleSpecialCases(tokens, config.mode);

	// Wrap in appropriate math delimiters
	const mathDelimiters = {
		inline: ['$', '$'],
		display: ['$$', '$$'],
		align: ['\\begin{align}\n', '\n\\end{align}']
	};

	const [openDelim, closeDelim] = mathDelimiters[config.mode] || mathDelimiters.inline;

	return openDelim + latexContent + closeDelim;
};
