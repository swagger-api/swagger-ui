/**
 * @prettier
 */
import React from "react"

import { useComponent } from "../../../hooks"
import { toSchemaObject } from "../../../fn"
import type { KeywordProps } from "../../../types"

const Examples = ({ schema }: KeywordProps) => {
  const examples = toSchemaObject(schema).examples || []
  const JSONViewer = useComponent("JSONViewer")

  if (!Array.isArray(examples) || examples.length === 0) {
    return null
  }

  return (
    <JSONViewer
      name="Examples"
      value={examples}
      tone="primary"
      keyword="examples"
    />
  )
}

export default Examples
