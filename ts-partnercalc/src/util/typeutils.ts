/**
 * Forces an object to behave like a Record<string, T>
 *  without widening the type and losing intellisense
 */
export function preserve<T>() {
    return <U extends Record<string, T>>(obj: U) => obj
}
