/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const AuthItem = createOnlyOAS31ComponentWrapper(({ originalComponent: Ori, ...props }) => {
  const { name, errSelectors, authorized, getComponent, onChange, schema } = props
  const HttpAuth = getComponent("HttpAuth")
  const JumpToPath = getComponent("JumpToPath", true)
  const type = schema.get("type")
  const description = schema.get("description")
  
if(type === "http") {
    return <HttpAuth key={ name }
              schema={ schema }
              name={ name }
              errSelectors={ errSelectors }
              authorized={ authorized }
              getComponent={ getComponent }
              onChange={ onChange }/>
  } else if (type === "mutualTLS") {
    return <div>
      <h4>{name} (mutualTLS) <JumpToPath path={[ "securityDefinitions", name ]} /></h4>
      <p>Mutual TLS is required by this API/Operation. Try-it-out in SwaggerUI doesn&apos;t currently support client-side certificates</p>
      <p>{description}</p>
    </div>
  } else {
    return <Ori {...props} />
  }
})

export default AuthItem
