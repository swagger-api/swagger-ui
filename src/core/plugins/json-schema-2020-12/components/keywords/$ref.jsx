/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $ref = ({ schema }) => {
  if (!schema?.$ref) return null

  return (
    <div className="json-schema-2020-12__$ref">
      <span className="json-schema-2020-12-core-keyword">$ref</span>
      <span className="json-schema-2020-12-core-keyword__value">
        {schema.$ref}
      </span>
    </div>
  )
}

$ref.propTypes = {
  schema: schema.isRequired,
}

export default $ref
