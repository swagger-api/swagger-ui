import React from "react"
import PropTypes from "prop-types"
import Remarkable from "remarkable"
import sanitize from "sanitize-html"

function Markdown({ source }) {
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
    allowedTags: sanitize.defaults.allowedTags.concat([ "h1", "h2", "img" ]),
    allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        "img": sanitize.defaults.allowedAttributes.img.concat(["title"])
    },
    textFilter: function(text) {
        return text.replace(/&quot;/g, "\"")
    }
}

export function sanitizer(str) {
    return sanitize(str, sanitizeOptions)
}
