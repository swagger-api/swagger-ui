import React from "react"
import cx from "classnames"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export const ParameterIncludeEmpty = ({ param, isIncluded, onChange, isDisabled }) => {
  const onCheckboxChange = e => {
    onChange(e.target.checked)
  }
  if(!param.get("allowEmptyValue")) {
    return null
  }
  return <div className={cx("parameter__empty_value_toggle", {
    "disabled": isDisabled
  })}>
    <input type="checkbox" disabled={isDisabled} checked={!isDisabled && isIncluded} onChange={onCheckboxChange} />
    Send empty value
  </div>
}
ParameterIncludeEmpty.propTypes = {
  param: ImPropTypes.map.isRequired,
  isIncluded: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ParameterIncludeEmpty
