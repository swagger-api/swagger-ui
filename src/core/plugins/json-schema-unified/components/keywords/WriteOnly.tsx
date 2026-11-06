/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { toSchemaObject } from "../../fn"
import { ATTRIBUTE } from "../../styles"
import type { KeywordProps } from "../../types"

const WriteOnly = ({ schema }: KeywordProps) => {
  if (toSchemaObject(schema).writeOnly !== true) return null

  return (
    <span className={ATTRIBUTE.muted} data-keyword="writeOnly">
      write-only
    </span>
  )
}

WriteOnly.propTypes = {
  schema: schema.isRequired,
}

export default WriteOnly
