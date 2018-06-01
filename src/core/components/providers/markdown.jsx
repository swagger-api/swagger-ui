import React from "react"
import PropTypes from "prop-types"
import Remarkable from "remarkable"
import DomPurify from "dompurify"
import cx from "classnames"

// eslint-disable-next-line no-useless-escape
const isPlainText = (str) => /^[A-Z\s0-9!?\.]+$/gi.test(str)

function Markdown({ source, className = "" }) {
    if(isPlainText(source)) {
      // If the source text is not Markdown,
      // let's save some time and just render it.
      return <div className="markdown">
        {source}
      </div>
    }
    const html = new Remarkable({
        html: true,
        typographer: true,
        breaks: true,
        linkify: true,
        linkTarget: "_blank"
    }).render(source)
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
