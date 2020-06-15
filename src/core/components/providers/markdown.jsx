import React from "react"
import PropTypes from "prop-types"
import { Remarkable } from "remarkable"
import { linkify } from "remarkable/linkify"
import DomPurify from "dompurify"
import cx from "classnames"

if (DomPurify.addHook) {
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
}

function Markdown({ source, className = "", getConfigs }) {
  if (typeof source !== "string") {
    return null
  }

  const md = new Remarkable({
    html: true,
    typographer: true,
    breaks: true,
    linkTarget: "_blank"
  }).use(linkify)

  md.core.ruler.disable(["replacements", "smartquotes"])

  const { useUnsafeMarkdown } = getConfigs()
  const html = md.render(source)
  const sanitized = sanitizer(html, { useUnsafeMarkdown })

  if (!source || !html || !sanitized) {
    return null
  }

  return (
    <div className={cx(className, "markdown")} dangerouslySetInnerHTML={{ __html: sanitized }}></div>
  )
}

Markdown.propTypes = {
  source: PropTypes.string.isRequired,
  className: PropTypes.string,
  getConfigs: PropTypes.func,
}

Markdown.defaultProps = {
  getConfigs: () => ({ useUnsafeMarkdown: false }),
}

export default Markdown

export function sanitizer(str, { useUnsafeMarkdown = false } = {}) {
  const ALLOW_DATA_ATTR = useUnsafeMarkdown
  const FORBID_ATTR = useUnsafeMarkdown ? [] : ["style", "class"]

  if (useUnsafeMarkdown && !sanitizer.hasWarnedAboutDeprecation) {
    console.warn(`useUnsafeMarkdown display configuration parameter is deprecated since >3.26.0 and will be removed in v4.0.0.`)
    sanitizer.hasWarnedAboutDeprecation = true
  }

  return DomPurify.sanitize(str, {
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["style"],
    ALLOW_DATA_ATTR,
    FORBID_ATTR,
  })
}
sanitizer.hasWarnedAboutDeprecation = false
