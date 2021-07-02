import { Map } from "immutable"
import React from "react"

export const isEnabled = (state) => {
  return state
    .get("enabled")
}
export const getFilteredSpec = (state) => {
  return state.get("filteredSpec")
}
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
export const getPhrase = (state) => {
  return state
    .get("phrase")
}
