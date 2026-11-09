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

const $schema = ({ schema }: KeywordProps) => {
  const value = toSchemaObject(schema).$schema

  if (!value) return null

  return (
    <div className={KEYWORD} data-keyword="$schema">
      <span className={KEYWORD_NAME.secondary}>$schema</span>
      <span className={classNames(KEYWORD_VALUE.secondary, VALUE_AFTER_NAME)}>
        {value}
      </span>
    </div>
  )
}

export default $schema
