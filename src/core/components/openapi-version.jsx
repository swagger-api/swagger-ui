/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const OpenApiVersion = ({ version }) => (
  <small className="version-stamp">
    <pre className="version">{version}</pre>
  </small>
)

OpenApiVersion.propTypes = {
  version: PropTypes.string.isRequired,
}

export default OpenApiVersion
