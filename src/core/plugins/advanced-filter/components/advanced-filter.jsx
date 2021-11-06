import React from "react"
import PropTypes from "prop-types"


export const AdvancedFilter = ({ advancedFilterSelectors, advancedFilterActions, specSelectors, getComponent }) => {
  const onFilterChange = (e) => {
    const { target: { value } } = e
    advancedFilterActions.updatePhrase(value)
  }

  const AdvancedFilterOptions = getComponent("AdvancedFilterOptions", true)
  const isLoading = specSelectors.loadingStatus() === "loading"
  const isFailed = specSelectors.loadingStatus() === "failed"
  const isEnabled = advancedFilterSelectors.isEnabled()
  const phrase = advancedFilterSelectors.getPhrase()
  const classNames = ["operation-filter-input"]
  if (isFailed) classNames.push("failed")
  if (isLoading) classNames.push("loading")

  return (
    isEnabled
      ? (
        <div className="advanced-filter-wrapper">
          <div className="input-wrapper">
            <input className={classNames.join(" ")} placeholder="Enter your filter phrase..." type="text"
                   onChange={onFilterChange} value={phrase === true || phrase === "true" ? "" : phrase}
                   disabled={isLoading} />
          </div>
          <AdvancedFilterOptions />
        </div>
      )
      : null

  )
}

AdvancedFilter.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  advancedFilterSelectors: PropTypes.object.isRequired,
  advancedFilterActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
}
