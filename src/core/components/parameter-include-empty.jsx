import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export const ParameterIncludeEmpty = ({ param, isIncluded, onChange }) => {
  const onCheckboxChange = e => {
    onChange(e.target.checked)
  }
  if(!param.get("allowEmptyValue")) {
    return null
  }
  return <div className="parameter__empty_value_toggle pt2 pb3">
    <input type="checkbox" checked={isIncluded} onChange={onCheckboxChange} />
    <span>
      Include empty value in request
    </span>
  </div>
}
ParameterIncludeEmpty.propTypes = {
  param: ImPropTypes.map.isRequired
}

export default ParameterIncludeEmpty
