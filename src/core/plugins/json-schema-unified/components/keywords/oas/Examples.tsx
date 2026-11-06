/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"
import Examples from "../Examples/Examples"
import type { KeywordProps } from "../../../types"

/**
 * The OAS dialects' `examples` slot: the 2020-12 `examples` keyword followed
 * by the OpenAPI keywords, in the order the oas31/oas32 Examples wrapper
 * renders them (discriminator, xml, externalDocs, example).
 *
 * The OAS dialect replaces the `KeywordExamples` slot with this component, so
 * the 2020-12 `Examples` is imported here rather than looked up by that name.
 */
const OASExamples = ({ schema }: KeywordProps) => {
  const KeywordDiscriminator = useComponent("KeywordDiscriminator")
  const KeywordXml = useComponent("KeywordXml")
  const KeywordExternalDocs = useComponent("KeywordExternalDocs")
  const KeywordExample = useComponent("KeywordExample")

  return (
    <>
      <Examples schema={schema} />
      <KeywordDiscriminator schema={schema} />
      <KeywordXml schema={schema} />
      <KeywordExternalDocs schema={schema} />
      <KeywordExample schema={schema} />
    </>
  )
}

OASExamples.propTypes = {
  schema: schema.isRequired,
}

export default OASExamples
