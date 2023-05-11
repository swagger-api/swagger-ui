/**
 * @prettier
 */
import React from "react"
import { createOnlyOAS31ComponentWrapper } from "../../../fn"

const DefaultWrapper = createOnlyOAS31ComponentWrapper(
  ({ schema, getSystem, originalComponent: KeywordDefault }) => {
    const { getComponent } = getSystem()
    const KeywordExample = getComponent("JSONSchema202012KeywordExample")
    const KeywordXml = getComponent("JSONSchema202012KeywordXml")

    return (
      <>
        <KeywordDefault schema={schema} />
        <KeywordExample schema={schema} getSystem={getSystem} />
        <KeywordXml schema={schema} getSystem={getSystem} />
      </>
    )
  }
)

export default DefaultWrapper
