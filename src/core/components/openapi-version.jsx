import React from "react"
import PropTypes from "prop-types"


const OpenAPIVersion = ({ oasVersion }) => (
  <small className="version-stamp">
    <pre className="version">OAS {oasVersion}</pre>
  </small>
)

OpenAPIVersion.propTypes = {
  oasVersion: PropTypes.string.isRequired
}

export default OpenAPIVersion
