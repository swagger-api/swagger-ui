/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const Ref = ({ schema }) => {
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

Ref.propTypes = {
  schema: schema.isRequired,
}

export default Ref
