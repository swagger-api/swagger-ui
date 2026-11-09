/**
 * @prettier
 */
import React from "react"
import classNames from "classnames"

import { toSchemaObject } from "../../fn"
import {
  KEYWORD,
  KEYWORD_NAME,
  KEYWORD_VALUE,
  VALUE_AFTER_NAME,
} from "../../styles"
import type { KeywordProps } from "../../types"

const $comment = ({ schema }: KeywordProps) => {
  const value = toSchemaObject(schema).$comment

  if (!value) return null

  return (
    <div className={KEYWORD} data-keyword="$comment">
      <span className={KEYWORD_NAME.secondary}>$comment</span>
      <span className={classNames(KEYWORD_VALUE.secondary, VALUE_AFTER_NAME)}>
        {value}
      </span>
    </div>
  )
}

export default $comment
