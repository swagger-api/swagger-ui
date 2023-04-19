/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $anchor = ({ schema }) => {
  if (!schema?.$anchor) return null

  return (
    <div className="json-schema-2020-12__$anchor">
      <span className="json-schema-2020-12-core-keyword">$anchor</span>
      <span className="json-schema-2020-12-core-keyword__value">
        {schema.$anchor}
      </span>
    </div>
  )
}

$anchor.propTypes = {
  schema: schema.isRequired,
}

export default $anchor
