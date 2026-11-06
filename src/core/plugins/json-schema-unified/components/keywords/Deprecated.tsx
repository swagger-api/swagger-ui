/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { toSchemaObject } from "../../fn"
import { ATTRIBUTE } from "../../styles"
import type { KeywordProps } from "../../types"

const Deprecated = ({ schema }: KeywordProps) => {
  if (toSchemaObject(schema).deprecated !== true) return null

  return (
    <span className={ATTRIBUTE.warning} data-keyword="deprecated">
      deprecated
    </span>
  )
}

Deprecated.propTypes = {
  schema: schema.isRequired,
}

export default Deprecated
