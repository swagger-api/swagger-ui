import React from "react"
import ImPropTypes from "react-immutable-proptypes"

const EnumModel = ({ value, getComponent }) => {
  return <span className="prop-enum">
    Enum:<br />
      [ { value.join(", ") } ]
  </span>
}
EnumModel.propTypes = {
  value: ImPropTypes.iterable,
  getComponent: ImPropTypes.func
}

export default EnumModel
