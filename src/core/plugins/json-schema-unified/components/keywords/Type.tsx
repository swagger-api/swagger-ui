/**
 * @prettier
 */
import React from "react"

import { useFn } from "../../hooks"
import { ATTRIBUTE } from "../../styles"
import type { KeywordProps } from "../../types"

export interface TypeProps extends KeywordProps {
  isCircular?: boolean
}

const Type = ({ schema, isCircular = false }: TypeProps) => {
  const fn = useFn()
  const type = fn.getType(schema)
  const circularSuffix = isCircular ? " [circular]" : ""

  return (
    <strong className={ATTRIBUTE.primary} data-keyword="type">
      {`${type}${circularSuffix}`}
    </strong>
  )
}

export default Type
