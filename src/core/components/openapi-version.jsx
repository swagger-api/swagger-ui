import React from "react"
import PropTypes from "prop-types"


const OpenAPIVersion = ({ oasVersion }) => (
  <small className="version-stamp">
    <span className="version">OAS {oasVersion}</span>
  </small>
)

OpenAPIVersion.propTypes = {
  oasVersion: PropTypes.string.isRequired
}

export default OpenAPIVersion
