import { createSelector } from "reselect"
import { Map } from "immutable"

const state = state => state || Map()

export const getGenerators = createSelector(
  state,
  state => {
    const languageKeys = state
      .get("languages")
    const generators = state
      .get("generators", Map())
    if(!languageKeys) {
      return generators
    }
    return generators
      .filter((v, key) => languageKeys.includes(key))
  }
)

export const getSnippetGenerators = (state) => ({ fn }) => {
  const getGenFn = (key) => fn[`requestSnippetGenerator_${key}`]
  return getGenerators(state)
    .map((gen, key) => {
      const genFn = getGenFn(key)
      if(typeof genFn !== "function") {
        return null
      }

      return gen.set("fn", genFn)
    })
    .filter(v => v)
}

export const getActiveLanguage = createSelector(
  state,
  state => state
    .get("activeLanguage")
)

export const getDefaultExpanded = createSelector(
  state,
  state => state
    .get("defaultExpanded")
)
