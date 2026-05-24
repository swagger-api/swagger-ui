import React from "react"
import { OAS3ComponentWrapFactory } from "../helpers"

export default OAS3ComponentWrapFactory(({ Ori, ...props }) => {
  const {
    schema,
    getComponent,
    errors,
    onChange,
    fn
  } = props

  const isFileUploadIntended = fn.isFileUploadIntended(schema)
  const Input = getComponent("Input")

  if (isFileUploadIntended) {
    return <Input type="file"
                   className={ errors.length ? "invalid" : ""}
                   title={ errors.length ? errors : ""}
                   onChange={(e) => {
                     onChange(e.target.files[0])
                   }}
                   disabled={Ori.isDisabled}/>
  } else {
    return <Ori {...props} />
  }
})
