/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../../fn"

const AuthItem = createOnlyOAS31ComponentWrapper(
  ({ originalComponent: Ori, ...props }) => {
    const { getComponent, schema, name } = props
    const MutualTLSAuth = getComponent("MutualTLSAuth", true)
    const type = schema.get("type")

    if (type === "mutualTLS") {
      return <MutualTLSAuth schema={schema} name={name} />
    }

    return <Ori {...props} />
  }
)

export default AuthItem
