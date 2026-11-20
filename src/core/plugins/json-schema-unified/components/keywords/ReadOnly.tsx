/**
 * @prettier
 */
import React from "react"

import { toSchemaObject } from "../../fn"
import { ATTRIBUTE } from "../../styles"
import type { KeywordProps } from "../../types"

const ReadOnly = ({ schema }: KeywordProps) => {
  if (toSchemaObject(schema).readOnly !== true) return null

  return (
    <span className={ATTRIBUTE.muted} data-keyword="readOnly">
      read-only
    </span>
  )
}

export default ReadOnly
