import { Map } from "immutable"
import React from "react"

export const getMatcherOptionsAsComponents = (state) => ({ getComponent }) => {
  const registeredMatcherOptionKeys = state
    .get("matcherOptions", Map())
    .keySeq()
    .toArray()

  return registeredMatcherOptionKeys
    .map(key => {
      const Component = getComponent(`MatcherOption_${key}`, true)

      return (
        // eslint-disable-next-line react/jsx-filename-extension
        <Component key={key} optionKey={key} />
      )
    })
}

export const getMatcherOptions = (state) => {
  return state
    .get("matcherOptions")
}

export const getMatcherOption = (state, optionKey) => {
  return state
    .getIn(["matcherOptions", optionKey])
}
