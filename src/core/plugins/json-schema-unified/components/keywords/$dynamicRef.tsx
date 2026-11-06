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

const $dynamicRef = ({ schema }: KeywordProps) => {
  const value = toSchemaObject(schema).$dynamicRef

  if (!value) return null

  return (
    <div className={KEYWORD} data-keyword="$dynamicRef">
      <span className={KEYWORD_NAME.secondary}>$dynamicRef</span>
      <span className={classNames(KEYWORD_VALUE.secondary, VALUE_AFTER_NAME)}>
        {value}
      </span>
    </div>
  )
}

$dynamicRef.propTypes = {
  schema: schema.isRequired,
}

export default $dynamicRef
