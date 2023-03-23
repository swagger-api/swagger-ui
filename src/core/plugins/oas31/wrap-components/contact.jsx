/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const ContactWrapper = createOnlyOAS31ComponentWrapper(({ getSystem }) => {
  const system = getSystem()
  const OAS31Contact = system.getComponent("OAS31Contact", true)

  return <OAS31Contact />
})

export default ContactWrapper
