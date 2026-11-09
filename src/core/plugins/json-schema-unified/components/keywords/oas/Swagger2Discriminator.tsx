/**
 * @prettier
 */
import React from "react"

import { toSchemaObject } from "../../../fn"
import { ATTRIBUTE, KEYWORD, KEYWORD_NAME } from "../../../styles"
import type { KeywordProps } from "../../../types"

/**
 * OpenAPI 2.0 `discriminator`: the name of the property that decides the
 * schema, a string (3.x has a Discriminator Object). Rendered like the 3.x
 * discriminator's head: the label and the property name as a muted attribute.
 */
const Swagger2Discriminator = ({ schema }: KeywordProps) => {
  const { discriminator } = toSchemaObject(schema)

  if (typeof discriminator !== "string" || discriminator === "") return null

  return (
    <div className={KEYWORD} data-keyword="discriminator">
      <span className={KEYWORD_NAME.secondary}>Discriminator</span>
      <span className={ATTRIBUTE.muted}>{discriminator}</span>
    </div>
  )
}

export default Swagger2Discriminator
