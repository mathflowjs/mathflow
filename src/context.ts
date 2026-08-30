import { solve, solveBatch, type IResult } from './solve';
import { addBuiltinFunctions, type IComputeFunction } from './functions';
import {
    type IHTMLRenderResult,
    renderTokensAsHTML,
    type IHTMLRenderOptions
} from './render/html';
import { tokenize } from './lexer';
import { renderTokensAsLaTeX, type ILaTeXRenderOptions } from './render/latex';

type IPreferences = {
    fractionDigits: number;
    precision: number;
    angles: 'rad' | 'deg';
};

export type IContext = {
    preferences: Partial<IPreferences>;
    variables: Map<string, number>;
    constants: Map<string, number>;
    functions: Map<string, IComputeFunction>;
};

export interface IContextAPI extends IContext {
    solve(code: string): IResult;
    solveBatch(code: string): IResult[];
    renderAsHTML(
        code: string,
        options?: Partial<IHTMLRenderOptions>
    ): IHTMLRenderResult;
    renderAsLaTeX(code: string, options?: Partial<ILaTeXRenderOptions>): string;
}

export type IContextOptions = {
    preferences: Partial<IPreferences>;
    variables: Record<string, number>;
    constants: Record<string, number>;
    functions: Record<string, IComputeFunction>;
};

function merge<T>(dest: Map<string, T>, src: Record<string, T>) {
    for (const k in src) {
        const v = src[k];
        dest.set(k, v);
    }
}

/**
 * isolated math execution context
 */
export function createContext(
    options: Partial<IContextOptions> = {}
): IContextAPI {
    const ctx: IContext = {
        variables: new Map(),
        functions: new Map(),
        preferences: {
            fractionDigits: 15,
            precision: 15,
            angles: 'rad'
        },
        constants: new Map([
            ['pi', Math.PI],
            ['e', Math.E]
        ])
    };

    Object.assign(ctx.preferences, options.preferences);

    if (options?.constants) {
        merge(ctx.constants, options.constants);
    }

    if (options?.variables) {
        merge(ctx.variables, options.variables);
    }

    if (options?.functions) {
        merge(ctx.functions, options.functions);
    }

    addBuiltinFunctions(ctx);

    return {
        ...ctx,
        solve(code: string) {
            return solve(ctx, code);
        },
        solveBatch(code: string) {
            return solveBatch(ctx, code);
        },
        renderAsHTML(code: string, options?: IHTMLRenderOptions) {
            return renderTokensAsHTML(tokenize(ctx, code), options);
        },
        renderAsLaTeX(code: string, options?: ILaTeXRenderOptions) {
            return renderTokensAsLaTeX(tokenize(ctx, code), options);
        }
    };
}
