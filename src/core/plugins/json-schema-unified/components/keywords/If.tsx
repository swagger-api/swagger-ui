/**
 * @prettier
 */
import React from "react"

import { useFn, useComponent } from "../../hooks"
import { KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const If = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "if")) return null

  const name = <span className={KEYWORD_NAME.primary}>If</span>

  return (
    <div className={KEYWORD} data-keyword="if">
      <JSONSchema name={name} schema={schema.if} identifier="if" />
    </div>
  )
}

export default If
