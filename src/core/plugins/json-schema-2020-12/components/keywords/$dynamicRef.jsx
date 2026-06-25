/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const DynamicRef = ({ schema }) => {
  if (!schema?.$dynamicRef) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$dynamicRef">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
        $dynamicRef
      </span>
      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
        {schema.$dynamicRef}
      </span>
    </div>
  )
}

DynamicRef.propTypes = {
  schema: schema.isRequired,
}

export default DynamicRef
