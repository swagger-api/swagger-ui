import React from "react"
import cx from "classnames"
import PropTypes from "prop-types"

export const ParameterIncludeEmpty = ({ isIncluded, onChange, isDisabled }) => {
  const onCheckboxChange = e => {
    onChange(e.target.checked)
  }
  return <label className={cx("parameter__empty_value_toggle", {
    "disabled": isDisabled
  })}>
    <input type="checkbox" disabled={isDisabled} checked={!isDisabled && isIncluded} onChange={onCheckboxChange} />
    Send empty value
  </label>
}
ParameterIncludeEmpty.propTypes = {
  isIncluded: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ParameterIncludeEmpty
