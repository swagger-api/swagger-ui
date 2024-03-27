/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"

const ContentSchema = ({ schema }) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "contentSchema")) return null

  const name = (
    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
      Content schema
    </span>
  )

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--contentSchema">
      <JSONSchema name={name} schema={schema.contentSchema} />
    </div>
  )
}

ContentSchema.propTypes = {
  schema: schema.isRequired,
}

export default ContentSchema
