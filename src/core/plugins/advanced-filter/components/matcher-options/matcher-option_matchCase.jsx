import React from "react"
import PropTypes from "prop-types"

/* eslint-disable camelcase */

export const MatcherOption_matchCase = ({ optionKey, getComponent }) => {
  const MatcherOptionSimpleButton = getComponent("MatcherOptionSimpleButton", true)
  return (
    <MatcherOptionSimpleButton title="Match Case" text="Aa" optionKey={optionKey} />
  )
}

MatcherOption_matchCase.propTypes = {
  getComponent: PropTypes.object.isRequired,
  key: PropTypes.object.isRequired,
  optionKey: PropTypes.object.isRequired,
}
