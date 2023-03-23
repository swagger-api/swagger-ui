/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const LicenseWrapper = createOnlyOAS31ComponentWrapper(({ getSystem }) => {
  const system = getSystem()
  const OAS31License = system.getComponent("OAS31License", true)

  return <OAS31License />
})

export default LicenseWrapper
