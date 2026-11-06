/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"
import { KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const Else = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "else")) return null

  const name = <span className={KEYWORD_NAME.primary}>Else</span>

  return (
    <div className={KEYWORD} data-keyword="else">
      <JSONSchema name={name} schema={schema.else} identifier="else" />
    </div>
  )
}

Else.propTypes = {
  schema: schema.isRequired,
}

export default Else
