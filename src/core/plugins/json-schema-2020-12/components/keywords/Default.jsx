/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn } from "../../hooks"

const Default = ({ schema }) => {
  const fn = useFn()

  if (!fn.hasKeyword(schema, "default")) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--default">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
        Default
      </span>
      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--const">
        {fn.stringify(schema.default)}
      </span>
    </div>
  )
}

Default.propTypes = {
  schema: schema.isRequired,
}

export default Default
