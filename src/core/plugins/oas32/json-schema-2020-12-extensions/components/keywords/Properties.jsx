/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

const Properties = ({ schema, getSystem }) => {
  const { fn, getComponent } = getSystem()
  const { useComponent, usePath } = fn.jsonSchema202012
  const { getDependentRequired, getProperties } = fn.jsonSchema202012.useFn()
  const config = fn.jsonSchema202012.useConfig()
  const required = Array.isArray(schema?.required) ? schema.required : []
  const { path } = usePath("properties")
  const JSONSchema = useComponent("JSONSchema")
  const JSONSchemaPathContext = getComponent("JSONSchema202012PathContext")()
  const properties = getProperties(schema, config)

  /**
   * Rendering.
   */
  if (Object.keys(properties).length === 0) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
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
    </JSONSchemaPathContext.Provider>
  )
}

Properties.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  getSystem: PropTypes.func.isRequired,
}

export default Properties
