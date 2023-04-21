/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $ref = ({ schema }) => {
  if (!schema?.$ref) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$ref">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
        $ref
      </span>
      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
        {schema.$ref}
      </span>
    </div>
  )
}

$ref.propTypes = {
  schema: schema.isRequired,
}

export default $ref
