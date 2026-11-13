/**
 * @prettier
 */
import React from "react"
import classNames from "classnames"

import { useFn } from "../../../hooks"
import { REF_TOOLTIP } from "../../../styles"
import type { KeywordProps } from "../../../types"

export interface RefPathProps extends KeywordProps {
  /** A top-level schema's tooltip sits closer to its title. */
  isTopLevel?: boolean
}

/**
 * The reference path of a dereferenced schema (e.g. `#/definitions/Category`)
 * as a tooltip above its title, json-schema-5's `.model-hint`. Rendered
 * collapsed or expanded, hidden until the title is hovered or focused. Only
 * the 2.0/3.0 dialects set `fn.getRefPath`; other instances render nothing.
 */
const RefPath = ({ schema, isTopLevel = false }: RefPathProps) => {
  const fn = useFn()
  const refPath =
    typeof fn.getRefPath === "function" ? fn.getRefPath(schema) : ""

  if (!refPath) return null

  return (
    <span
      role="tooltip"
      className={classNames(
        REF_TOOLTIP.base,
        isTopLevel ? REF_TOOLTIP.topLevel : REF_TOOLTIP.nested
      )}
      data-keyword="$$ref"
    >
      {refPath}
    </span>
  )
}

export default RefPath
