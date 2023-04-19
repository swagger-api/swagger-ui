/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $schema = ({ schema }) => {
  if (!schema?.$schema) return null

  return (
    <div className="json-schema-2020-12__$schema">
      <span className="json-schema-2020-12-core-keyword">$schema</span>
      <span className="json-schema-2020-12-core-keyword__value">
        {schema.$schema}
      </span>
    </div>
  )
}

$schema.propTypes = {
  schema: schema.isRequired,
}

export default $schema
