import React, { PropTypes } from "react"
import Remarkable from "react-remarkable"
import sanitize from "sanitize-html"

function Markdown({ source }) {
  const sanitized = sanitizer(source)
  return <Remarkable
    options={{html: true, typographer: true, linkify: true, linkTarget: "_blank"}}
    source={sanitized}
    ></Remarkable>
}

Markdown.propTypes = {
  source: PropTypes.string.isRequired
}

export default Markdown

const sanitizeOptions = {
  textFilter: function(text) {
    return text
      .replace(/&quot;/g, "\"")
  }
}

export function sanitizer(str) {
  return sanitize(str, sanitizeOptions)
}
