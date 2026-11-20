/**
 * @prettier
 */
import React from "react"

import { useFn, useComponent } from "../../hooks"
import { KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const UnevaluatedItems = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "unevaluatedItems")) return null

  const name = <span className={KEYWORD_NAME.primary}>Unevaluated items</span>

  return (
    <div className={KEYWORD} data-keyword="unevaluatedItems">
      <JSONSchema
        name={name}
        schema={schema.unevaluatedItems}
        identifier="unevaluatedItems"
      />
    </div>
  )
}

export default UnevaluatedItems
