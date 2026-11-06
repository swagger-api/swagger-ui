/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"
import { KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const Then = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "then")) return null

  const name = <span className={KEYWORD_NAME.primary}>Then</span>

  return (
    <div className={KEYWORD} data-keyword="then">
      <JSONSchema name={name} schema={schema.then} identifier="then" />
    </div>
  )
}

Then.propTypes = {
  schema: schema.isRequired,
}

export default Then
