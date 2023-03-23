/**
 * @prettier
 */
import React from "react"

const VersionStampWrapper = (Original, system) => (props) => {
  if (system.specSelectors.isOAS31()) {
    return (
      <span>
        <Original {...props} />
        <small className="version-stamp">
          <pre className="version">OAS 3.1</pre>
        </small>
      </span>
    )
  }

  return <Original {...props} />
}

export default VersionStampWrapper
