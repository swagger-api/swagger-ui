import React from "react"
import PropTypes from "prop-types"

export const DeepLink = ({ enabled, path, text }) => {
    return (
        <a className="nostyle"
          href={enabled ? `#/${path}` : null}
          onClick={enabled ? (e) => e.preventDefault() : null}>
          <span>{text}</span>
        </a>
    )
}

DeepLink.propTypes = {
  enabled: PropTypes.bool,
  isShown: PropTypes.bool,
  path: PropTypes.string,
  text: PropTypes.string
}

export default DeepLink
