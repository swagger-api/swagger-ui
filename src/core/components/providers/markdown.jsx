import React from "react"
import PropTypes from "prop-types"
import Remarkable from "react-remarkable"
import sanitize from "sanitize-html"

const sanitizeOptions = {
  textFilter: function(text) {
    return text
      .replace(/&quot;/g, "\"")
  }
}

function Markdown({ source }) {
  const sanitized = sanitize(source, sanitizeOptions)

  // sometimes the sanitizer returns "undefined" as a string
  if(!source || !sanitized || sanitized === "undefined") {
    return null
  }

  return <div className="markdown">
    <Remarkable
      options={{html: true, typographer: true, breaks: true, linkify: true, linkTarget: "_blank"}}
      source={source}
      ></Remarkable>
  </div>
}

Markdown.propTypes = {
  source: PropTypes.string.isRequired
}

export default Markdown
