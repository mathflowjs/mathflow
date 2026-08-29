export enum ERRORS {
    LEXICAL = 'LexicalError',
    SYNTAX = 'SyntaxError',
    RUNTIME = 'RuntimeError'
    // VARIABLE = 'VariableError'
}

export type IError = {
    name: string;
    type: ERRORS;
    message: string;
    suggestion: string | null;
    toString(): string;
};

export function createError(
    type: ERRORS,
    message: string,
    suggestion: string | null = null
): IError {
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

export type ISafeResult<T = unknown> =
    | {
          data: T;
          error: undefined;
      }
    | {
          data: undefined;
          error: IError;
      };

/**
 * Run any throwing mathflow API and get `{ data, error }` back instead
 */
export function safe<T = unknown>(fn: () => T): ISafeResult<T> {
    try {
        const data = fn();
        return { data, error: undefined };
    } catch (error) {
        return {
            data: undefined,
            error: error as ReturnType<typeof createError>
        };
    }
}
