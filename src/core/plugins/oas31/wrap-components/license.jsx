/**
 * @prettier
 */
import React from "react"

const LicenseWrapper = (Original, system) => (props) => {
  const isOAS31 = system.specSelectors.isOAS31?.() || false

  if (isOAS31) {
    const OAS31License = system.getComponent("OAS31License", true)
    return <OAS31License {...props} />
  }

  return <Original {...props} />
}

export default LicenseWrapper
