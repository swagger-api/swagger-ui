import React from "react"
import { OAS3ComponentWrapFactory } from "../helpers"

export default OAS3ComponentWrapFactory((props) => {
  const { Ori } = props

  return <span>
    <Ori {...props} />
    <small style={{ backgroundColor: "#89bf04" }}>
      <pre className="version">OAS3</pre>
    </small>
  </span>
})
