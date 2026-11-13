/**
 * @prettier
 */
import React from "react"

import { useComponent, useFn } from "../../../hooks"
import type { KeywordProps } from "../../../types"

const Default = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONViewer = useComponent("JSONViewer")

  if (!fn.hasKeyword(schema, "default")) return null

  return (
    <JSONViewer
      name="Default"
      value={schema.default}
      tone="primary"
      keyword="default"
    />
  )
}

export default Default
