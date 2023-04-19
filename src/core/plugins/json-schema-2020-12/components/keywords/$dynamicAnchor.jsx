/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $dynamicAnchor = ({ schema }) => {
  if (!schema?.$dynamicAnchor) return null

  return (
    <div className="json-schema-2020-12__$dynamicAnchor">
      <span className="json-schema-2020-12-core-keyword">$dynamicAnchor</span>
      <span className="json-schema-2020-12-core-keyword__value">
        {schema.$dynamicAnchor}
      </span>
    </div>
  )
}

$dynamicAnchor.propTypes = {
  schema: schema.isRequired,
}

export default $dynamicAnchor
