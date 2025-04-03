/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent, useFn } from "../../../hooks"

const Const = ({ schema }) => {
  const fn = useFn()
  const JSONViewer = useComponent("JSONViewer")

  if (!fn.hasKeyword(schema, "const")) return null

  return (
    <JSONViewer
      name="Const"
      value={schema.const}
      className="json-schema-2020-12-keyword json-schema-2020-12-keyword--const"
    />
  )
}

Const.propTypes = {
  schema: schema.isRequired,
}

export default Const
