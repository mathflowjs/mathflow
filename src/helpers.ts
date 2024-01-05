/**
 * Convert an angle _deg_ from `degrees` to `radians`
 */
export function toRadians(deg: number): number {
    return (deg * Math.PI) / 180;
}

/**
 * Convert an angle _rad_ from `radians` to `degrees`
 */
export function toDegrees(rad: number): number {
    return (rad * 180) / Math.PI;
}
