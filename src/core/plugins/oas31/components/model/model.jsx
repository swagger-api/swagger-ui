/**
 * @prettier
 */
import React, { forwardRef, useCallback } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

import { getModelName } from "../../../../utils/get-model-name"

const Model = forwardRef(
  ({ schema, getComponent, onToggle = () => {}, specPath }, ref) => {
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
        identifier={specPath.toJS().join("_")}
      />
    )
  }
)

Model.propTypes = {
  schema: ImPropTypes.map.isRequired,
  getComponent: PropTypes.func.isRequired,
  onToggle: PropTypes.func,
  specPath: ImPropTypes.list.isRequired,
}

export default Model
