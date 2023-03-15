/**
 * @prettier
 */
import { Map } from "immutable"

import { isOAS31 as isOAS31Helper } from "../helpers"

export const isOAS31 = () => (system) => {
  const spec = system.specSelectors.specJson()
  return isOAS31Helper(spec)
}

const onlyOAS31 =
  (selector) =>
  () =>
  (system, ...args) => {
    if (system.getSystem().specSelectors.isOAS31()) {
      const result = selector(...args)
      return typeof result === "function" ? result(system, ...args) : result
    } else {
      return null
    }
  }

export const webhooks = onlyOAS31(() => (system) => {
  const spec = system.specSelectors.specJson()
  return spec.get("webhooks", webhooks.mapConst)
})
webhooks.mapConst = Map()
