/**
 * @prettier
 */
import React from "react"

import { useComponent, useFn } from "../../../hooks"
import type { KeywordProps } from "../../../types"

const Const = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONViewer = useComponent("JSONViewer")

  if (!fn.hasKeyword(schema, "const")) return null

  return (
    <JSONViewer
      name="Const"
      value={schema.const}
      tone="primary"
      keyword="const"
    />
  )
}

export default Const
