/**
 * @prettier
 */
import React from "react"

import { useFn, useComponent } from "../../hooks"
import { ATTRIBUTE, KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const AdditionalProperties = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  if (!fn.hasKeyword(schema, "additionalProperties")) return null

  /**
   * Rendering.
   */
  const name = (
    <span className={KEYWORD_NAME.primary}>Additional properties</span>
  )

  return (
    <div className={KEYWORD} data-keyword="additionalProperties">
      {schema.additionalProperties === true ? (
        <>
          {name}
          <span className={ATTRIBUTE.primary}>allowed</span>
        </>
      ) : schema.additionalProperties === false ? (
        <>
          {name}
          <span className={ATTRIBUTE.primary}>forbidden</span>
        </>
      ) : (
        <JSONSchema
          name={name}
          schema={schema.additionalProperties}
          identifier="additionalProperties"
        />
      )}
    </div>
  )
}

export default AdditionalProperties
