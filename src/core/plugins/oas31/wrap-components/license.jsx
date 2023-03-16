/**
 * @prettier
 */
import React from "react"

const LicenseWrapper = (Original, system) => (props) => {
  if (system.specSelectors.isOAS31()) {
    const OAS31License = system.getComponent("OAS31License", true)

    return <OAS31License />
  }

  return <Original {...props} />
}

export default LicenseWrapper
