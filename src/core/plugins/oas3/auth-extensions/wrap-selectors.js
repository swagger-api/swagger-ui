import { createSelector } from "reselect"
import { isOAS3 as isOAS3Helper } from "../helpers"


// Helpers

function onlyOAS3(selector) {
  return (ori, system) => (...args) => {
    const spec = system.getSystem().specSelectors.specJson()
    if(isOAS3Helper(spec)) {
      return selector(...args)
    } else {
      return ori(...args)
    }
  }
}

const nullSelector =  createSelector(() => null)

const OAS3NullSelector = onlyOAS3(nullSelector)

// Hasta la vista, authentication!
export const shownDefinitions = OAS3NullSelector
export const definitionsToAuthorize = OAS3NullSelector
export const getDefinitionsByNames = OAS3NullSelector
export const authorized = OAS3NullSelector
export const isAuthorized = OAS3NullSelector
export const getConfigs = OAS3NullSelector
