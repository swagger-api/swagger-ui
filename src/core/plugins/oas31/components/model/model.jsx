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

const Model = forwardRef(({ schema, getComponent, onToggle }, ref) => {
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
})

Model.propTypes = {
  schema: ImPropTypes.map.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specPath: ImPropTypes.list.isRequired,
  name: PropTypes.string,
  displayName: PropTypes.string,
  isRef: PropTypes.bool,
  required: PropTypes.bool,
  expandDepth: PropTypes.number,
  depth: PropTypes.number,
  includeReadOnly: PropTypes.bool,
  includeWriteOnly: PropTypes.bool,
  onToggle: PropTypes.func,
}

Model.defaultProps = {
  name: "",
  displayName: "",
  isRef: false,
  required: false,
  expandDepth: 0,
  depth: 1,
  includeReadOnly: false,
  includeWriteOnly: false,
  onToggle: () => {},
}

export default Model
