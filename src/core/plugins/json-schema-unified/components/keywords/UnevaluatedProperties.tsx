/**
 * @prettier
 */
import React from "react"

import { useFn, useComponent } from "../../hooks"
import { KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const UnevaluatedProperties = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "unevaluatedProperties")) return null

  const name = (
    <span className={KEYWORD_NAME.primary}>Unevaluated properties</span>
  )

  return (
    <div className={KEYWORD} data-keyword="unevaluatedProperties">
      <JSONSchema
        name={name}
        schema={schema.unevaluatedProperties}
        identifier="unevaluatedProperties"
      />
    </div>
  )
}

export default UnevaluatedProperties
