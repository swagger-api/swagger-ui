import React from "react"
import PropTypes from "prop-types"
import { stringify } from "core/utils"

export const Property = ({ propKey, propVal, propClass }) => {
    return (
        <span className={ propClass }>
          <br />{ propKey }: { stringify(propVal) }</span>
    )
}
Property.propTypes = {
  propKey: PropTypes.string,
  propVal: PropTypes.any,
  propClass: PropTypes.string
}

export default Property
