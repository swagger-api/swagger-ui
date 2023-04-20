/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $comment = ({ schema }) => {
  if (!schema?.$comment) return null

  return (
    <div className="json-schema-2020-12__$comment">
      <span className="json-schema-2020-12-core-keyword">$comment</span>
      <span className="json-schema-2020-12-core-keyword__value">
        {schema.$comment}
      </span>
    </div>
  )
}

$comment.propTypes = {
  schema: schema.isRequired,
}

export default $comment
