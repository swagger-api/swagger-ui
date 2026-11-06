/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"
import { KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const ContentSchema = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "contentSchema")) return null

  const name = <span className={KEYWORD_NAME.primary}>Content schema</span>

  return (
    <div className={KEYWORD} data-keyword="contentSchema">
      <JSONSchema
        name={name}
        schema={schema.contentSchema}
        identifier="contentSchema"
      />
    </div>
  )
}

ContentSchema.propTypes = {
  schema: schema.isRequired,
}

export default ContentSchema
