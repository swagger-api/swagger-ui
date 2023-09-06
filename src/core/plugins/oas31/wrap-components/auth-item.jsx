/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const AuthItem = createOnlyOAS31ComponentWrapper(
  ({ originalComponent: Ori, ...props }) => {
    const { name, errSelectors, authorized } = props
    const { getComponent, onChange, schema } = props
    const HttpAuth = getComponent("HttpAuth")
    const MutualTLSAuth = getComponent("MutualTLSAuth", true)
    const type = schema.get("type")

    if (type === "http") {
      return (
        <HttpAuth
          schema={schema}
          name={name}
          errSelectors={errSelectors}
          authorized={authorized}
          getComponent={getComponent}
          onChange={onChange}
        />
      )
    } else if (type === "mutualTLS") {
      return <MutualTLSAuth schema={schema} />
    }

    return <Ori {...props} />
  }
)

export default AuthItem
