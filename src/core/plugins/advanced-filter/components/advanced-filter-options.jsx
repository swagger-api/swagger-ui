import React from "react"
import PropTypes from "prop-types"

export const AdvancedFilterOptions = ({ advancedFilterSelectors, getComponent }) => {
  const matcherOptionComponents = advancedFilterSelectors.getMatcherOptionsAsComponents()
  const MatcherMultiSelect = getComponent("MatcherMultiSelect", true)
  return (
    <div className="advanced-filter-options-wrapper">
      {matcherOptionComponents}
      <MatcherMultiSelect />
    </div>
  )
}
AdvancedFilterOptions.propTypes = {
  advancedFilterSelectors: PropTypes.object,
  getComponent: PropTypes.func,
}
