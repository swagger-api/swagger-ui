/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS32ComponentWrapper } from "../fn"

const InfoWrapper = createOnlyOAS32ComponentWrapper(({ getSystem }) => {
  const system = getSystem()
  const OAS32Info = system.getComponent("OAS32Info", true)

  return <OAS32Info />
})

export default InfoWrapper
