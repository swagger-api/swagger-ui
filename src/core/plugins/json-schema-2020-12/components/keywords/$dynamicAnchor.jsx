/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $dynamicAnchor = ({ schema }) => {
  if (!schema?.$dynamicAnchor) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$dynamicAnchor">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
        $dynamicAnchor
      </span>
      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
        {schema.$dynamicAnchor}
      </span>
    </div>
  )
}

$dynamicAnchor.propTypes = {
  schema: schema.isRequired,
}

export default $dynamicAnchor
