/**
 * @prettier
 */
import React from "react"

import { useFn } from "../../../hooks"
import { REF_PATH } from "../../../styles"
import type { KeywordProps } from "../../../types"

/**
 * The reference path of a dereferenced schema (e.g. `#/definitions/Category`),
 * json-schema-5's `.model-hint`. Only the 2.0/3.0 dialects set
 * `fn.getRefPath`; other instances render nothing.
 */
const RefPath = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const refPath =
    typeof fn.getRefPath === "function" ? fn.getRefPath(schema) : ""

  if (!refPath) return null

  return (
    <span className={REF_PATH} data-keyword="$$ref">
      {refPath}
    </span>
  )
}

export default RefPath
