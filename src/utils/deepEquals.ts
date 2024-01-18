
/*
type SupportedType =
    | string
    | number
    | boolean
    | SupportedType[]
    | { [key: string]: SupportedType }
    | null
    | undefined
    | Program

    */

export function deepEquals(a: unknown, b: unknown): boolean {

    if (typeof a !== typeof b) return false;

    // We will skip handling these types for now, and thus return false if they're encountered
    if (
        typeof a === 'bigint' ||
        typeof b === 'bigint' ||
        typeof a === 'function' ||
        typeof b === 'function' ||
        typeof a === 'symbol' ||
        typeof b === 'symbol'
    ) {
        throw new Error(`One of these types [${typeof a}, ${typeof b}] is not supported!`);
    }

    if (
        a && typeof a === 'object' &&
        b && typeof b === 'object'
    ) {
        // array
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;

            return a.every((el, i) => deepEquals(el, b[i]));
        }

        // If one of them is an array but the other is not, they cannot be equal, so return false
        if (Array.isArray(a) || Array.isArray(b)) return false;

        // object
        const k1 = Object.keys(a);
        const k2 = Object.keys(b);
    
        if (k1.length != k2.length) return false;

        for (const key of k1) {
            if (!deepEquals(a[key], b[key])) {
                return false;
            }
        }
    
        return true;
    }

    /*
     *  If a and b are neither objects, array, nor unsupported types
     *  we can assume they are primitive types (string, boolean, number, undefined, null)
     *  and thus can simply be compared using the '===' operator
    */
    return a === b;
}
