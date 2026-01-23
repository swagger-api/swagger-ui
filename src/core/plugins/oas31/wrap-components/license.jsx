/**
 * @prettier
 */
import React from "react"

const LicenseWrapper = (Original, system) => (props) => {
  const isOAS31 = system.specSelectors.isOAS31?.() || false
  const isOAS32 = system.specSelectors.isOAS32?.() || false

  // Use OAS31License for both OAS 3.1 and OAS 3.2 specs
  if (isOAS31 || isOAS32) {
    const OAS31License = system.getComponent("OAS31License", true)
    return <OAS31License {...props} />
  }

  return <Original {...props} />
}

export default LicenseWrapper
