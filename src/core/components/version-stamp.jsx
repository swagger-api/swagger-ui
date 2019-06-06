import React from "react"
import PropTypes from "prop-types"

const VersionStamp = ({ version }) => (
  <div>
    <small><pre className="version"> { version } </pre></small>
  </div>
)

VersionStamp.propTypes = {
  version: PropTypes.string.isRequired
}

export default VersionStamp
