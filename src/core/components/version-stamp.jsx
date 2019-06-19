import React from "react"
import PropTypes from "prop-types"

const VersionStamp = ({ version, children }) => (
  <div className="info__version-stamp">
    <small><pre className="version"> { version } </pre></small>
    { children }
  </div>
)

VersionStamp.propTypes = {
  version: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default VersionStamp
