/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useComponent } from "../../hooks"

const Items = ({ schema }) => {
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!schema?.items) return null

  const name = (
    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
      Items
    </span>
  )

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--items">
      <JSONSchema name={name} schema={schema.items} />
    </div>
  )
}

Items.propTypes = {
  schema: schema.isRequired,
}

export default Items
