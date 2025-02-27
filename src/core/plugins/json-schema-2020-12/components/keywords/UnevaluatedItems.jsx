/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"

const UnevaluatedItems = ({ schema }) => {
  const fn = useFn()
  const { unevaluatedItems } = schema
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "unevaluatedItems")) return null

  const name = (
    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
      Unevaluated items
    </span>
  )

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--unevaluatedItems">
      <JSONSchema
        name={name}
        schema={unevaluatedItems}
        identifier="unevaluatedItems"
      />
    </div>
  )
}

UnevaluatedItems.propTypes = {
  schema: schema.isRequired,
}

export default UnevaluatedItems
