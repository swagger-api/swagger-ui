import React from "react"
import PropTypes from "prop-types"

export const Property = ({ propKey, propVal, propClass }) => {
    return (
        <span className={ propClass }>
          <br />{ propKey }: { String(propVal) }</span>
    )
}
Property.propTypes = {
  propKey: PropTypes.string,
  propVal: PropTypes.any,
  propClass: PropTypes.string
}

export default Property
