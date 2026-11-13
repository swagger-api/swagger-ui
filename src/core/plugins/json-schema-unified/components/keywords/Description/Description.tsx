/**
 * @prettier
 */
import React from "react"
import classNames from "classnames"

import { toSchemaObject } from "../../../fn"
import { DESCRIPTION, KEYWORD } from "../../../styles"
import type { KeywordProps } from "../../../types"

const Description = ({ schema }: KeywordProps) => {
  const description = toSchemaObject(schema).description

  if (!description) return null

  return (
    <div
      className={classNames(KEYWORD, DESCRIPTION)}
      data-keyword="description"
    >
      <div>{description}</div>
    </div>
  )
}

export default Description
