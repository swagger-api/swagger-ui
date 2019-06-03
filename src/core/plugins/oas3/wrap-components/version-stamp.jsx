import React from "react"
import { OAS3ComponentWrapFactory } from "../helpers"

export default OAS3ComponentWrapFactory((props) => {
  const { Ori, translate } = props

  return <span>
    <Ori {...props} />
    <small style={{ backgroundColor: "#89bf04" }}>
      <pre className="version">{translate("versions.oas3")}</pre>
    </small>
  </span>
})
