import React from "react"
import { OAS3ComponentWrapFactory } from "../../helpers"

export default OAS3ComponentWrapFactory(({ Ori, ...props }) => {
  const {
    schema, getComponent, errSelectors, authorized, onAuthChange, name, authSelectors
  } = props

  const HttpAuth = getComponent("HttpAuth")
  const type = schema.get("type")


  if(type === "http") {
    return <HttpAuth key={ name }
              schema={ schema }
              name={ name }
              errSelectors={ errSelectors }
              authorized={ authorized }
              getComponent={ getComponent }
              onChange={ onAuthChange }
              authSelectors= { authSelectors }/>
  } else {
    return <Ori {...props} />
  }
})
