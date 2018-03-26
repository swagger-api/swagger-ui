import React from "react"
import PropTypes from "prop-types"
import Remarkable from "remarkable"
import sanitize from "sanitize-html"

// eslint-disable-next-line no-useless-escape
const isPlainText = (str) => /^[A-Z\s0-9!?\.]+$/gi.test(str)

function Markdown({ source }) {
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
        <div className="markdown" dangerouslySetInnerHTML={{ __html: sanitized }}></div>
    )
}

Markdown.propTypes = {
    source: PropTypes.string.isRequired
}

export default Markdown

const sanitizeOptions = {
    allowedTags: sanitize.defaults.allowedTags.concat([ "h1", "h2", "img", "span" ]),
    allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        "img": sanitize.defaults.allowedAttributes.img.concat(["title"]),
        "td": [ "colspan" ],
        "*": [ "class" ]
    },
    allowedSchemesByTag: { img: [ "http", "https", "data" ] },
    textFilter: function(text) {
        return text.replace(/&quot;/g, "\"")
    }
}

export function sanitizer(str) {
    return sanitize(str, sanitizeOptions)
}
