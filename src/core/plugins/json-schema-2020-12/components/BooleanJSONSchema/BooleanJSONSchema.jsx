/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { booleanSchema } from "../../prop-types"

const BooleanJSONSchema = ({ schema, name }) => {
  return (
    <article className="json-schema-2020-12 json-schema-2020-12--boolean">
      <span>{name}</span>
      <span>{schema ? "true" : "false"}</span>
    </article>
  )
}

BooleanJSONSchema.propTypes = {
  schema: booleanSchema.isRequired,
  name: PropTypes.string,
}

BooleanJSONSchema.defaultProps = {
  name: "",
}

export default BooleanJSONSchema
