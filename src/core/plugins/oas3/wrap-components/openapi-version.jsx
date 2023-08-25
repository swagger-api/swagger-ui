/**
 * @prettier
 */
import React from "react"

import { OAS30ComponentWrapFactory } from "../helpers"

export default OAS30ComponentWrapFactory((props) => {
  const { Ori } = props
  return <Ori version="OAS 3.0" />
})
