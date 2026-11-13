/**
 * @prettier
 */
import React from "react"
import classNames from "classnames"

import { useFn, useComponent, usePath } from "../../../hooks"
import { JSONSchemaPathContext } from "../../../context"
import { toSchemaObject } from "../../../fn"
import {
  KEYWORD,
  PROPERTIES_LIST,
  PROPERTY,
  PROPERTY_REQUIRED,
} from "../../../styles"
import type { KeywordProps, Schema } from "../../../types"

export interface PropertiesListProps extends KeywordProps {
  /** The properties of `schema` to render (all of them, or a filtered subset). */
  properties: Record<string, Schema>
}

/**
 * The markup of the `properties` keyword, shared by `Properties` (every
 * property) and the OAS dialects' `OASProperties` (filtered properties).
 */
export const PropertiesList = ({ schema, properties }: PropertiesListProps) => {
  const fn = useFn()
  const schemaObject = toSchemaObject(schema)
  const required = Array.isArray(schemaObject.required)
    ? schemaObject.required
    : []
  const JSONSchema = useComponent("JSONSchema")
  const { path } = usePath("properties")

  /**
   * Rendering.
   */
  if (Object.keys(properties).length === 0) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <div className={KEYWORD} data-keyword="properties">
        <ul className={PROPERTIES_LIST}>
          {Object.entries(properties).map(([propertyName, propertySchema]) => {
            const isRequired = required.includes(propertyName)
            const dependentRequired = fn.getDependentRequired(
              propertyName,
              schema
            )

            return (
              <li
                key={propertyName}
                className={classNames(
                  PROPERTY,
                  isRequired && PROPERTY_REQUIRED
                )}
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

const Properties = ({ schema }: KeywordProps) => (
  <PropertiesList
    schema={schema}
    properties={toSchemaObject(schema).properties || {}}
  />
)

export default Properties
