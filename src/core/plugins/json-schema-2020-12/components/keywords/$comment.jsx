/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const $comment = ({ schema }) => {
  if (!schema?.$comment) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$comment">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
        $comment
      </span>
      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
        {schema.$comment}
      </span>
    </div>
  )
}

$comment.propTypes = {
  schema: schema.isRequired,
}

export default $comment
