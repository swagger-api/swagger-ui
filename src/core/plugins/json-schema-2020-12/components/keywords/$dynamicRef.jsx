/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $dynamicRef = ({ schema }) => {
  if (!schema?.$dynamicRef) return null

  return (
    <div className="json-schema-2020-12__$dynamicRef">
      <span className="json-schema-2020-12-core-keyword">$dynamicRef</span>
      <span className="json-schema-2020-12-core-keyword__value">
        {schema.$dynamicRef}
      </span>
    </div>
  )
}

$dynamicRef.propTypes = {
  schema: schema.isRequired,
}

export default $dynamicRef
