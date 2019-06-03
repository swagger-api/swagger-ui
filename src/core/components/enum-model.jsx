import React from "react"
import ImPropTypes from "react-immutable-proptypes"

const EnumModel = ({ value, getComponent, translate }) => {
  let ModelCollapse = getComponent("ModelCollapse")
  let collapsedContent = <span>{"Array ["} { value.count() } {"]"}</span>
  return <span className="prop-enum">
    {translate("models.enum")}<br />
    <ModelCollapse collapsedContent={ collapsedContent }>
      {"["} { value.join(", ") } {"]"}
    </ModelCollapse>
  </span>
}
EnumModel.propTypes = {
  value: ImPropTypes.iterable,
  getComponent: ImPropTypes.func,
  translate: ImPropTypes.func.isRequired
}

export default EnumModel
