export enum ERRORS {
    LEXICAL = 'LexicalError',
    SYNTAX = 'SyntaxError',
    RUNTIME = 'RuntimeError'
    // VARIABLE = 'VariableError'
}

export function createError(
    type: ERRORS,
    message: string,
    suggestion: string | null = null
) {
    return {
        name: 'MathFlowError',
        type,
        message,
        suggestion,
        toString() {
            return (
                `${this.type}: ${this.message}` +
                (this.suggestion ? ` (${this.suggestion})` : '')
            );
        }
    };
}
