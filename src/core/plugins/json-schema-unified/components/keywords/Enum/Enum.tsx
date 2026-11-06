/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"
import { toSchemaObject } from "../../../fn"
import type { KeywordProps } from "../../../types"

const Enum = ({ schema }: KeywordProps) => {
  const JSONViewer = useComponent("JSONViewer")
  const value = toSchemaObject(schema).enum

  if (!Array.isArray(value)) return null

  return <JSONViewer name="Enum" value={value} tone="primary" keyword="enum" />
}

Enum.propTypes = {
  schema: schema.isRequired,
}

export default Enum
