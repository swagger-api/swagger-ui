/**
 * @prettier
 */
import React from "react"
import { createOnlyOAS31ComponentWrapper } from "../../../fn"

const ExamplesWrapper = createOnlyOAS31ComponentWrapper(
  ({ schema, getSystem, originalComponent: KeywordExamples }) => {
    const { getComponent } = getSystem()
    const KeywordDiscriminator = getComponent(
      "JSONSchema202012KeywordDiscriminator"
    )
    const KeywordXml = getComponent("JSONSchema202012KeywordXml")
    const KeywordExample = getComponent("JSONSchema202012KeywordExample")
    const KeywordExternalDocs = getComponent(
      "JSONSchema202012KeywordExternalDocs"
    )

    return (
      <>
        <KeywordExamples schema={schema} />
        <KeywordDiscriminator schema={schema} getSystem={getSystem} />
        <KeywordXml schema={schema} getSystem={getSystem} />
        <KeywordExternalDocs schema={schema} getSystem={getSystem} />
        <KeywordExample schema={schema} getSystem={getSystem} />
      </>
    )
  }
)

export default ExamplesWrapper
