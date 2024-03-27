/**
 * @prettier
 */
import React, { forwardRef, useCallback } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const decodeRefName = (uri) => {
  const unescaped = uri.replace(/~1/g, "/").replace(/~0/g, "~")
  try {
    return decodeURIComponent(unescaped)
  } catch {
    return unescaped
  }
}
const getModelName = (uri) => {
  if (typeof uri === "string" && uri.includes("#/components/schemas/")) {
    return decodeRefName(uri.replace(/^.*#\/components\/schemas\//, ""))
  }
  return null
}

const Model = forwardRef(
  ({ schema, getComponent, onToggle = () => {} }, ref) => {
    const JSONSchema202012 = getComponent("JSONSchema202012")
    const name = getModelName(schema.get("$$ref"))

    const handleExpand = useCallback(
      (e, expanded) => {
        onToggle(name, expanded)
      },
      [name, onToggle]
    )

    return (
      <JSONSchema202012
        name={name}
        schema={schema.toJS()}
        ref={ref}
        onExpand={handleExpand}
      />
    )
  }
)

Model.propTypes = {
  schema: ImPropTypes.map.isRequired,
  getComponent: PropTypes.func.isRequired,
  onToggle: PropTypes.func,
}

export default Model
