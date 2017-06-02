import React from "react"
import Remarkable from "react-remarkable"
import sanitize from "sanitize-html"

export default function Markdown({ source }) {
  const sanitized = sanitize(source)
  return <Remarkable
    options={{html: true, typographer: true, linkify: true, linkTarget: "_blank"}}
    source={sanitized}
    ></Remarkable>
}
