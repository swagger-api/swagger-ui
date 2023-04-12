/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import * as propTypes from "../../prop-types"
import { useComponent, useFn } from "../../hooks"

const JSONSchema = ({ schema, name }) => {
  const fn = useFn()

  const BooleanJSONSchema = useComponent("BooleanJSONSchema")

  if (fn.isBooleanJSONSchema(schema)) {
    return <BooleanJSONSchema schema={schema} name={name} />
  }

  return (
    <article className="json-schema-2020-12 model-container">
      <div className="model-box">
        <div className="model">
          <div className="json-schema-2020-12__title model-title">
            {name || fn.getTitle(schema)}
          </div>
        </div>
      </div>
    </article>
  )
}

JSONSchema.propTypes = {
  name: PropTypes.string,
  schema: propTypes.schema.isRequired,
}

JSONSchema.defaultProps = {
  name: "",
}

export default JSONSchema
