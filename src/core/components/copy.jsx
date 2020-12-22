import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import PropTypes from "prop-types"

Copy.propTypes = {
  text: PropTypes.string.isRequired,
}

/**
 * @param {{ text: string }} props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Copy(props) {
  return (
    <CopyToClipboard text={props.text}>
      <button className="copy-to-clipboard" onClick={stopPropagation}>
        <svg fill="currentColor" viewBox="0 0 16 16" width="1rem" height="1rem">
          <path
            d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2a1 1 0 01-1 1H1a1 1 0 01-1-1V4c0-.6.5-1 1-1h3c0-1.1.9-2 2-2a2 2 0 012 2h3c.6 0 1 .5 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.6-.5-1-1-1H8c-.6 0-1-.5-1-1s-.5-1-1-1-1 .5-1 1-.5 1-1 1H3a1 1 0 00-1 1z"
          />
        </svg>
      </button>
    </CopyToClipboard>
  )
}

function stopPropagation(e) {
  e.stopPropagation()
}
