/**
 * @prettier
 */
import React from "react"

const InfoWrapper = (Original, system) => (props) => {
  if (system.specSelectors.isOAS31()) {
    const OAS31Info = system.getComponent("OAS31Info", true)

    return <OAS31Info />
  }

  return <Original {...props} />
}

export default InfoWrapper
