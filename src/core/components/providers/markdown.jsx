import React from "react"
import PropTypes from "prop-types"
import Remarkable from "react-remarkable"
import sanitize from "sanitize-html"

function Markdown({ source }) {
  const sanitized = sanitizer(source)

  // sometimes the sanitizer returns "undefined" as a string
  if(!source || !sanitized || sanitized === "undefined") {
    return null
  }

  return <div className="markdown">
    <Remarkable
      options={{html: true, typographer: true, breaks: true, linkify: true, linkTarget: "_blank"}}
      source={sanitized}
      ></Remarkable>
  </div>
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
