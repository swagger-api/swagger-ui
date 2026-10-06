import React from "react"
import PropTypes from "prop-types"

const VersionStamp = ({ version }) => {
  return <small><span className="version"> { version } </span></small>
}

VersionStamp.propTypes = {
  version: PropTypes.string.isRequired
}

export default VersionStamp
