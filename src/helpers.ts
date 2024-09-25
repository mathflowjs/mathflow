/**
 * check whether the token/node type matches the provided types
 */
export function matchValue<T>(expected: T, ...values: T[]): boolean {
    return values.includes(expected);
}
