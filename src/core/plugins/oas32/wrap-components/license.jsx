/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS32ComponentWrapper } from "../fn"

export default createOnlyOAS32ComponentWrapper((props) => {
  const { getSystem } = props
  const system = getSystem()
  const OAS31License = system.getComponent("OAS31License", true)
  return <OAS31License {...props} />
})
