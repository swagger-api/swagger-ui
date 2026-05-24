/**
 * @prettier
 */
import React from "react"

const VersionPragmaFilterWrapper = (Original, system) => (props) => {
  const isOAS32 = system.specSelectors.isOAS32()

  const OAS32VersionPragmaFilter = system.getComponent(
    "OAS32VersionPragmaFilter"
  )

  return <OAS32VersionPragmaFilter isOAS32={isOAS32} {...props} />
}

export default VersionPragmaFilterWrapper
