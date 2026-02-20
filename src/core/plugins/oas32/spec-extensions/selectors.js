/**
 * @prettier
 */
import { isOAS32 } from "../fn"

/**
 * Detects if the current spec is OAS 3.2.x
 */
export const selectIsOAS32 = (state, system) => () => {
  const spec = system.specSelectors.specJson()
  return isOAS32(spec)
}
