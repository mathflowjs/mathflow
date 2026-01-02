import initNumbers from './numbers';
import initLogarithms from './logarithms';
import initTrignometry from './trignometry';
import { type IContext } from '../context';

export type IComputeFunction = (...args: number[]) => number;

export function addBuiltinFunctions(ctx: IContext) {
    const fns: Record<string, IComputeFunction> = {
        ...initNumbers(),
        ...initLogarithms(),
        ...initTrignometry(ctx.preferences)
    };

    for (const name in fns) {
        const fn = fns[name];
        ctx.functions.set(name, fn);
    }
}
