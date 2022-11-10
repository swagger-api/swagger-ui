import React from "react"
import PropTypes from "prop-types"

const VersionStamp = ({ version }) => {
  return <small><pre className="version"> { version } </pre></small>
}

VersionStamp.propTypes = {
  version: PropTypes.string.isRequired
}

export default VersionStamp
