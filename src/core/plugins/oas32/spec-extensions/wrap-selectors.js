/**
 * @prettier
 */
import { createOnlyOAS32SelectorWrapper } from "../fn"

/**
 * Wraps isOAS31 selector to return false when spec is OAS 3.2.x
 * This ensures OAS 3.2 specs are not detected as OAS 3.1
 */
export const isOAS31 = createOnlyOAS32SelectorWrapper(() => () => false)
