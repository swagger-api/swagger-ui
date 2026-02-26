/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS32ComponentWrapper } from "../fn"

export default createOnlyOAS32ComponentWrapper((props) => {
  const { getSystem } = props
  const system = getSystem()
  const OAS31Contact = system.getComponent("OAS31Contact", true)
  return <OAS31Contact {...props} />
})
