/**
 * @prettier
 */
import React from "react"

import { useComponent, useFn } from "../../../hooks"
import type { KeywordProps } from "../../../types"

/**
 * OpenAPI `example` (deprecated in favour of `examples`). The SCSS scope
 * `.json-schema-2020-12-keyword--example` has no rules, so the viewer keeps
 * the plain (secondary) tone.
 */
const Example = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONViewer = useComponent("JSONViewer")

  if (!fn.hasKeyword(schema, "example")) return null

  return <JSONViewer name="Example" value={schema.example} keyword="example" />
}

export default Example
