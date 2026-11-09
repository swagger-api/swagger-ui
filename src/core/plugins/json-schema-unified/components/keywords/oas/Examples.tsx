/**
 * @prettier
 */
import React from "react"

import { useComponent, useFn } from "../../../hooks"
import Examples from "../Examples/Examples"
import type { KeywordProps } from "../../../types"

/**
 * The OAS dialects' `examples` slot: the 2020-12 `examples` keyword followed
 * by the OpenAPI keywords, in the order the oas31/oas32 Examples wrapper
 * renders them (discriminator, xml, externalDocs, example).
 *
 * The OAS dialect replaces the `KeywordExamples` slot with this component, so
 * the 2020-12 `Examples` is imported here rather than looked up by that name.
 * It renders only when `examples` is a keyword of the instance's dialect (not
 * in 2.0/3.0, whose schemas have `example` only).
 */
const OASExamples = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const hasExamplesKeyword = fn.getSchemaKeywords().includes("examples")
  const KeywordDiscriminator = useComponent("KeywordDiscriminator")
  const KeywordXml = useComponent("KeywordXml")
  const KeywordExternalDocs = useComponent("KeywordExternalDocs")
  const KeywordExample = useComponent("KeywordExample")

  return (
    <>
      {hasExamplesKeyword && <Examples schema={schema} />}
      <KeywordDiscriminator schema={schema} />
      <KeywordXml schema={schema} />
      <KeywordExternalDocs schema={schema} />
      <KeywordExample schema={schema} />
    </>
  )
}

export default OASExamples
