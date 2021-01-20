import { Map } from "immutable"
import React from "react"

export const getActiveMatchers = (state) => {
  return state
    .get("matchers")
    .filter(v => v.get("isActive"))
}

export const getMatcher = (state, key) => {
  return state
    .getIn(["matchers", key])
}


export const getMatchersAsComponents = (state) => ({ getComponent }) => {
  const registeredMatcherOptionKeys = state
    .get("matchers", Map())
    .keySeq()
    .toArray()

  return registeredMatcherOptionKeys
    .map(key => {
      const Component = getComponent(`MatcherSelectOption_${key}`, true)

      return (
        // eslint-disable-next-line react/jsx-filename-extension
        <Component key={key} matcherKey={key} />
      )
    })
}
