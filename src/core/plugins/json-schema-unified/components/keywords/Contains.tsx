/**
 * @prettier
 */
import React from "react"

import { useFn, useComponent } from "../../hooks"
import { KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const Contains = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "contains")) return null

  const name = <span className={KEYWORD_NAME.primary}>Contains</span>

  return (
    <div className={KEYWORD} data-keyword="contains">
      <JSONSchema name={name} schema={schema.contains} identifier="contains" />
    </div>
  )
}

export default Contains
