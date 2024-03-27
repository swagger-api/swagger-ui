/**
 * @prettier
 */
import React from "react"

const VersionPragmaFilterWrapper = (Original, system) => (props) => {
  const isOAS31 = system.specSelectors.isOAS31()

  const OAS31VersionPragmaFilter = system.getComponent(
    "OAS31VersionPragmaFilter"
  )

  return <OAS31VersionPragmaFilter isOAS31={isOAS31} {...props} />
}

export default VersionPragmaFilterWrapper
