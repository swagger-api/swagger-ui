/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS32ComponentWrapper } from "../fn"

const InfoWrapper = createOnlyOAS32ComponentWrapper(({ getSystem }) => {
  const system = getSystem()
  const OAS31Info = system.getComponent("OAS31Info", true)

  return <OAS31Info />
})

export default InfoWrapper
