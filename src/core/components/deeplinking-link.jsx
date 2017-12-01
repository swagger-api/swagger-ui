import React from "react"
import PropTypes from "prop-types"

export const DeepLinkingLink = ({ isDeepLinkingEnabled, path, text }) => {
    return (
        <a className="nostyle"
          onClick={isDeepLinkingEnabled ? (e) => e.preventDefault() : null}
          href={isDeepLinkingEnabled ? `#/${path}` : null}>
          <span>{text}</span>
        </a>
    )
}
DeepLinkingLink.propTypes = {
  isDeepLinkingEnabled: PropTypes.boolean,
  path: PropTypes.string,
  text: PropTypes.string
}

export default DeepLinkingLink
