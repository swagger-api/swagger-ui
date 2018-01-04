import React from "react"
import { OAS3ComponentWrapFactory } from "../helpers"

export default OAS3ComponentWrapFactory(({ Ori, ...props }) => {
  const {
    schema, getComponent, errSelectors, authorized, onAuthChange, name,
  } = props

  const HttpAuth = getComponent("HttpAuth")
  const type = schema.get("type")

  if(type === "http") {
    return <HttpAuth key={ name }
      authorized={ authorized }
      errSelectors={ errSelectors }
      getComponent={ getComponent }
      name={ name }
      onChange={ onAuthChange }
      schema={ schema }/>
  } else {
    return <Ori {...props} />
  }
})
