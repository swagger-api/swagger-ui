/**
 * @prettier
 */
import React from "react"

import { OAS30ComponentWrapFactory } from "../helpers"

export default OAS30ComponentWrapFactory((props) => {
  const { Ori } = props

  return (
    <span>
      <Ori {...props} />
      <small className="version-stamp">
        <pre className="version">OAS 3.0</pre>
      </small>
    </span>
  )
})
