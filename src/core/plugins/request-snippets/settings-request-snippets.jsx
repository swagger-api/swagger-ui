import React from "react"
import PropTypes from "prop-types"

// eslint-disable-next-line camelcase
export const settings_requestSnippets = ({
  requestSnippetsSelectors,
  requestSnippetsActions,
  featuresActions
}) => {
  const onClick = () => {
    requestSnippetsActions.toggleDefaultExpanded()
    featuresActions.persistFeatures()
  }
  return (
    <ul className="requestSnippets">
      <li>
        <label className="feature-item-option">
          Expanded on default:
          <input className="checkbox" onChange={onClick} type="checkbox" checked={requestSnippetsSelectors.getDefaultExpanded()} />
        </label>
      </li>
    </ul>
  )
}

// eslint-disable-next-line camelcase
settings_requestSnippets.propTypes = {
  requestSnippetsSelectors: PropTypes.object.isRequired,
  requestSnippetsActions: PropTypes.object.isRequired,
  featuresActions: PropTypes.object.isRequired,
}
