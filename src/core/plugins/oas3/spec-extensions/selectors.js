import { Map } from "immutable"
import { isSwagger2 as isSwagger2Helper, isOAS30 as isOAS30Helper } from "../helpers"


/**
 * Helpers
 */

const map = Map()

export const isSwagger2 = () => (system) => {
  const spec = system.getSystem().specSelectors.specJson()
  return isSwagger2Helper(spec)
}

export const isOAS30 = () => (system) => {
  const spec = system.getSystem().specSelectors.specJson()
  return isOAS30Helper(spec)
}

export const isOAS3 = () => (system) => {
  return system.getSystem().specSelectors.isOAS30()
}

function onlyOAS3(selector) {
  return () => (system, ...args) => {
    const spec = system.getSystem().specSelectors.specJson()
    if(system.specSelectors.isOAS3(spec)) {
      const result = selector(...args)
      return typeof result === "function" ? result(system, ...args) : result
    } else {
      return null
    }
  }
}

export const servers = onlyOAS3(() => (system) => {
  const spec = system.specSelectors.specJson()
  return spec.get("servers", map)
})
