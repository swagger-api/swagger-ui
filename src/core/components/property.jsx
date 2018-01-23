import React from "react"
import PropTypes from "prop-types"

export const Property = ({ propKey, propVal, propStyle }) => {
    return (
        <span style={ propStyle }>
          <br />{ propKey }: { String(propVal) }</span>
    )
}
Property.propTypes = {
  propKey: PropTypes.string,
  propVal: PropTypes.any,
  propStyle: PropTypes.object
}

export default Property
