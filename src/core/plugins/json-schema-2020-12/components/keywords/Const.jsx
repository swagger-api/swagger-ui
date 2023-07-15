/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn } from "../../hooks"

const Const = ({ schema }) => {
  const fn = useFn()

  if (!fn.hasKeyword(schema, "const")) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--const">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
        Const
      </span>
      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--const">
        {fn.stringify(schema.const)}
      </span>
    </div>
  )
}

Const.propTypes = {
  schema: schema.isRequired,
}

export default Const
