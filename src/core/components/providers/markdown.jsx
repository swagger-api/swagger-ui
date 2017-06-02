import React, { PropTypes } from "react"
import Remarkable from "react-remarkable"
import sanitize from "sanitize-html"

function Markdown({ source }) {
  const sanitized = sanitize(source)
  return <Remarkable
    options={{html: true, typographer: true, linkify: true, linkTarget: "_blank"}}
    source={sanitized}
    ></Remarkable>
}

Markdown.propTypes = {
  source: PropTypes.string.isRequired
}

export default Markdown
