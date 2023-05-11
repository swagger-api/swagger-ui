/**
 * @prettier
 */
import React from "react"
import { createOnlyOAS31ComponentWrapper } from "../../../fn"

const DefaultWrapper = createOnlyOAS31ComponentWrapper(
  ({ schema, getSystem, originalComponent: KeywordDefault }) => {
    const { getComponent, fn } = getSystem()
    const KeywordExample = getComponent("JSONSchema202012KeywordExample")

    return (
      <>
        <KeywordDefault schema={schema} />
        <KeywordExample schema={schema} fn={fn} />
      </>
    )
  }
)

export default DefaultWrapper
