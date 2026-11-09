/**
 * @prettier
 */
import React from "react"

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

export default WriteOnly
