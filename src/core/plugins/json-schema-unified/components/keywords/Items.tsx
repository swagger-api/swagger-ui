/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"
import { KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const Items = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "items")) return null

  const name = <span className={KEYWORD_NAME.primary}>Items</span>

  return (
    <div className={KEYWORD} data-keyword="items">
      <JSONSchema name={name} schema={schema.items} identifier="items" />
    </div>
  )
}

Items.propTypes = {
  schema: schema.isRequired,
}

export default Items
