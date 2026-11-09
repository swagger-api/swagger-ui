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

const $anchor = ({ schema }: KeywordProps) => {
  const value = toSchemaObject(schema).$anchor

  if (!value) return null

  return (
    <div className={KEYWORD} data-keyword="$anchor">
      <span className={KEYWORD_NAME.secondary}>$anchor</span>
      <span className={classNames(KEYWORD_VALUE.secondary, VALUE_AFTER_NAME)}>
        {value}
      </span>
    </div>
  )
}

export default $anchor
