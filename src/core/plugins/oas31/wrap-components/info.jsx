/**
 * @prettier
 */
import React from "react"

const InfoWrapper = (Original, system) => (props) => {
  if (system.specSelectors.isOAS31()) {
    const OAS31Info = system.getComponent("OAS31Info")

    return <OAS31Info {...props} />
  }

  return <Original {...props} />
}

export default InfoWrapper
