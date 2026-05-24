/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent, useFn } from "../../../hooks"

const Default = ({ schema }) => {
  const fn = useFn()
  const JSONViewer = useComponent("JSONViewer")

  if (!fn.hasKeyword(schema, "default")) return null

  return (
    <JSONViewer
      name="Default"
      value={schema.default}
      className="json-schema-2020-12-keyword json-schema-2020-12-keyword--default"
    />
  )
}

Default.propTypes = {
  schema: schema.isRequired,
}

export default Default
