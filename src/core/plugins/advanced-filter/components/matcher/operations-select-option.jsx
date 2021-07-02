import React from "react"
import PropTypes from "prop-types"

/* eslint-disable camelcase */

export const MatcherSelectOption = ({ matcherKey, label, advancedFilterActions, advancedFilterSelectors }) => {
  const matcherState = advancedFilterSelectors.getMatcher(matcherKey)
  const isActive = matcherState.get("isActive")
  const onClick = () => {
    advancedFilterActions.setMatcherIsActive(matcherKey, !isActive)
    advancedFilterActions.updateFilteredSpec()
  }
  return (
    <label className="matcher-multi-select-option">
      <input onClick={onClick} type="checkbox" value={matcherKey} defaultChecked={isActive} />
      {label}
    </label>
  )
}
MatcherSelectOption.propTypes = {
  advancedFilterActions: PropTypes.object,
  advancedFilterSelectors: PropTypes.object,
  label: PropTypes.string.isRequired,
  matcherKey: PropTypes.string.isRequired,
}

export const MatcherSelectOption_operations = ({ getComponent, matcherKey }) => {
  const MatcherSelectOption = getComponent("MatcherSelectOption", true)
  return (
    <MatcherSelectOption matcherKey={matcherKey} label="operations" />
  )
}
MatcherSelectOption_operations.propTypes = {
  getComponent: PropTypes.func.isRequired,
  key: PropTypes.object.isRequired,
  matcherKey: PropTypes.object.isRequired,
}

export const MatcherSelectOption_tags = ({ getComponent, matcherKey }) => {
  const MatcherSelectOption = getComponent("MatcherSelectOption", true)
  return (
    <MatcherSelectOption matcherKey={matcherKey} label="tags" />
  )
}
MatcherSelectOption_tags.propTypes = {
  getComponent: PropTypes.func.isRequired,
  key: PropTypes.object.isRequired,
  matcherKey: PropTypes.object.isRequired,
}

export const MatcherSelectOption_definitions = ({ getComponent, matcherKey, specSelectors }) => {
  const MatcherSelectOption = getComponent("MatcherSelectOption", true)
  const isOAS3 = specSelectors.isOAS3()
  return (
    <MatcherSelectOption matcherKey={matcherKey} label={isOAS3 ? "schemas" : "models"} />
  )
}
MatcherSelectOption_definitions.propTypes = {
  getComponent: PropTypes.func.isRequired,
  key: PropTypes.object.isRequired,
  matcherKey: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
}
