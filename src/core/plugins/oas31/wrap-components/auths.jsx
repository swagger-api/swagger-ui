/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const AuthsWrapper = createOnlyOAS31ComponentWrapper(
  ({ getSystem, ...props }) => {
    const system = getSystem()
    const OAS31Auths = system.getComponent("OAS31Auths", true)

    return <OAS31Auths {...props} />
  }
)

export default AuthsWrapper
