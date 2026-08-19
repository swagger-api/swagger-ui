/**
 * @prettier
 */
import React, { useContext } from "react"
import { schema } from "../../prop-types"
import { JSONSchemaContext } from "../../context"

const $ref = ({ schema }) => {
  if (!schema?.$ref) return null

  const fn = useContext(JSONSchemaContext).fn

  // If the system exposed a ref resolver, attempt to show a friendly label
  try {
    if (fn && typeof fn.getRefSchemaByRef === "function") {
      const resolved = fn.getRefSchemaByRef(schema.$ref)
      if (resolved && typeof resolved === "object") {
        // array shorthand
        const type = Array.isArray(resolved.type)
          ? resolved.type[0]
          : resolved.type
        if (type === "array") {
          const items = resolved.items
          const itemLabel = items?.title || items?.$ref || items?.$id || "any"
          return (
            <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$ref">
              <span className="json-schema-2020-12-keyword__name">$ref</span>
              <span className="json-schema-2020-12-keyword__value">
                array&lt;{itemLabel}&gt;
              </span>
            </div>
          )
        }

        const label =
          resolved.title ||
          resolved.$id ||
          resolved.$ref ||
          resolved.type ||
          schema.$ref
        return (
          <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$ref">
            <span className="json-schema-2020-12-keyword__name">$ref</span>
            <span className="json-schema-2020-12-keyword__value">{label}</span>
          </div>
        )
      }
    }
  } catch (e) {
    // ignore and fall back
  }

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$ref">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
        $ref
      </span>
      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
        {schema.$ref}
      </span>
    </div>
  )
}

$ref.propTypes = {
  schema: schema.isRequired,
}

export default $ref
