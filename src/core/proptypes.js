import PropTypes from "prop-types"

// Takes a list and proptype, and returns a PropType.shape({ [item]: propType })
const mapListToPropTypeShape = (list, propType) => PropTypes.shape(
  list.reduce((shape, propName) => {
    shape[propName] = propType
    return shape
}, {}))


export const arrayOrString = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.string),
  PropTypes.string,
])

export const objectWithFuncs = list => mapListToPropTypeShape(list, PropTypes.func.isRequired)
