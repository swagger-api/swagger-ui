/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

/**
 * SelfUri Component
 *
 * Displays the $self field from OpenAPI 3.2.0 specification.
 *
 * Spec reference: https://spec.openapis.org/oas/v3.2.0.html#openapi-object
 *
 * The $self field provides the self-assigned URI of the document,
 * serving as its base URI for reference resolution.
 */
const SelfUri = ({ specSelectors }) => {
  const selfUri = specSelectors.selectSelfUriField()

  if (!selfUri) {
    return null
  }

  return (
    <div className="information-container">
      <div className="info">
        <div className="info__tos">
          <strong>Base URI:</strong>{" "}
          <a href={selfUri} target="_blank" rel="noopener noreferrer">
            {selfUri}
          </a>
        </div>
      </div>
    </div>
  )
}

SelfUri.propTypes = {
  specSelectors: PropTypes.shape({
    selectSelfUriField: PropTypes.func.isRequired,
  }).isRequired,
}

export default SelfUri
