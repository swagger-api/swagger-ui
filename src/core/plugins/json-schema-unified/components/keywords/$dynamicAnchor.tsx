/**
 * @prettier
 */
import React from "react"
import classNames from "classnames"

import { schema } from "../../prop-types"
import { toSchemaObject } from "../../fn"
import {
  KEYWORD,
  KEYWORD_NAME,
  KEYWORD_VALUE,
  VALUE_AFTER_NAME,
} from "../../styles"
import type { KeywordProps } from "../../types"

const $dynamicAnchor = ({ schema }: KeywordProps) => {
  const value = toSchemaObject(schema).$dynamicAnchor

  if (!value) return null

  return (
    <div className={KEYWORD} data-keyword="$dynamicAnchor">
      <span className={KEYWORD_NAME.secondary}>$dynamicAnchor</span>
      <span className={classNames(KEYWORD_VALUE.secondary, VALUE_AFTER_NAME)}>
        {value}
      </span>
    </div>
  )
}

$dynamicAnchor.propTypes = {
  schema: schema.isRequired,
}

export default $dynamicAnchor
