import React from "react"
import PropTypes from "prop-types"

/* eslint-disable camelcase */

export const MatcherOption_matchWholeWord = ({ optionKey, getComponent }) => {
  const MatcherOptionSimpleButton = getComponent("MatcherOptionSimpleButton", true)
  return (
    <MatcherOptionSimpleButton title="Match Whole Word" text="W" optionKey={optionKey}/>
  )
}
MatcherOption_matchWholeWord.propTypes = {
  getComponent: PropTypes.object.isRequired,
  key: PropTypes.object.isRequired,
  optionKey: PropTypes.object.isRequired,
}
