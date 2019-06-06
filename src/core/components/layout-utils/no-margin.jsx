import React from "react"
import PropTypes from "prop-types"

const NoMargin = ({children}) => <div style={{height: "auto", border: "none", margin: 0, padding: 0}}> {children} </div>

NoMargin.propTypes = {
  children: PropTypes.node
}

export default NoMargin