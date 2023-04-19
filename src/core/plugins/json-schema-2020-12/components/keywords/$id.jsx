/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $id = ({ schema }) => {
  if (!schema?.$id) return null

  return (
    <div className="json-schema-2020-12__$id">
      <span className="json-schema-2020-12-core-keyword">$id</span>
      <span className="json-schema-2020-12-core-keyword__value">
        ={schema.$id}
      </span>
    </div>
  )
}

$id.propTypes = {
  schema: schema.isRequired,
}

export default $id
