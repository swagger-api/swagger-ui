/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS32ComponentWrapper } from "../fn"

export default createOnlyOAS32ComponentWrapper((props) => {
  const { originalComponent: Ori } = props
  return <Ori oasVersion="3.2" />
})
