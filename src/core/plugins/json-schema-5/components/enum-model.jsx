import React from "react"
import ImPropTypes from "react-immutable-proptypes"

const EnumModel = ({ value, getComponent }) => {
  let ModelCollapse = getComponent("ModelCollapse")
  let collapsedContent = <span>Array [ { value.count() } ]</span>
  return <span className="prop-enum">
    Enum:<br />
    <ModelCollapse collapsedContent={ collapsedContent }>
      [ { value.map(String).join(", ") } ]
    </ModelCollapse>
  </span>
}
EnumModel.propTypes = {
  value: ImPropTypes.iterable,
  getComponent: ImPropTypes.func
}

export default EnumModel
