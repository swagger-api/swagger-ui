import React from "react"
import PropTypes from "prop-types"
import Remarkable from "remarkable"
import DomPurify from "dompurify"
import cx from "classnames"

DomPurify.addHook("beforeSanitizeElements", function (current, ) {
  // Attach safe `rel` values to all elements that contain an `href`,
  // i.e. all anchors that are links.
  // We _could_ just look for elements that have a non-self target,
  // but applying it more broadly shouldn't hurt anything, and is safer.
  if (current.href) {
    current.setAttribute("rel", "noopener noreferrer")
  }
  return current
})

// eslint-disable-next-line no-useless-escape
const isPlainText = (str) => /^[A-Z\s0-9!?\.]+$/gi.test(str)

function Markdown({ source, className = "" }) {
    if (typeof source !== "string") {
      return null
    }

    if(isPlainText(source)) {
      // If the source text is not Markdown,
      // let's save some time and just render it.
      return <div className="markdown">
        {source}
      </div>
    }

    const md = new Remarkable({
        html: true,
        typographer: true,
        breaks: true,
        linkify: true,
        linkTarget: "_blank"
    })
    
    md.core.ruler.disable(["replacements", "smartquotes"])

    const html = md.render(source)
    const sanitized = sanitizer(html)

    if ( !source || !html || !sanitized ) {
        return null
    }

    return (
        <div className={cx(className, "markdown")} dangerouslySetInnerHTML={{ __html: sanitized }}></div>
    )
}

Markdown.propTypes = {
    source: PropTypes.string.isRequired,
    className: PropTypes.string
}

export default Markdown

export function sanitizer(str) {
  return DomPurify.sanitize(str, {
    ADD_ATTR: ["target"]
  })
}
