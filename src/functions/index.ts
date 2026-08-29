import initNumbers from './numbers';
import initLogarithms from './logarithms';
import initTrignometry from './trignometry';
import initStatistics from './statistics';
import initProbability from './probability';
import initSpecial from './special';
import initFinance from './finance';
import initNumberTheory from './numbertheory';
import { type IContext } from '../context';

export type IComputeFunction = (...args: number[]) => number;

export function addBuiltinFunctions(ctx: IContext) {
    const fns: Record<string, IComputeFunction> = {
        ...initNumbers(),
        ...initLogarithms(),
        ...initTrignometry(ctx.preferences),
        ...initStatistics(),
        ...initProbability(),
        ...initSpecial(),
        ...initFinance(),
        ...initNumberTheory()
    };

    for (const name in fns) {
        const fn = fns[name];
        ctx.functions.set(name, fn);
    }
}
