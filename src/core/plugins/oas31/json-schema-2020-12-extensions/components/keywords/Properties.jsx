/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

const Properties = ({ schema, getSystem }) => {
  const { fn } = getSystem()
  const { useComponent } = fn.jsonSchema202012
  const { getDependentRequired, getProperties } = fn.jsonSchema202012.useFn()
  const config = fn.jsonSchema202012.useConfig()
  const required = Array.isArray(schema?.required) ? schema.required : []
  const JSONSchema = useComponent("JSONSchema")
  const properties = getProperties(schema, config)

  /**
   * Rendering.
   */
  if (Object.keys(properties).length === 0) {
    return null
  }

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--properties">
      <ul>
        {Object.entries(properties).map(([propertyName, propertySchema]) => {
          const isRequired = required.includes(propertyName)
          const dependentRequired = getDependentRequired(propertyName, schema)

          return (
            <li
              key={propertyName}
              className={classNames("json-schema-2020-12-property", {
                "json-schema-2020-12-property--required": isRequired,
              })}
            >
              <JSONSchema
                name={propertyName}
                schema={propertySchema}
                dependentRequired={dependentRequired}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

Properties.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  getSystem: PropTypes.func.isRequired,
}

export default Properties
