import React from "react"
import ReactMarkdown from "react-markdown"
import { Parser, HtmlRenderer } from "commonmark"
import { OAS3ComponentWrapFactory } from "../helpers"
import { sanitizer } from "core/components/providers/markdown"

export default OAS3ComponentWrapFactory(({ source }) => { 
  if ( source ) {
    const parser = new Parser()
    const writer = new HtmlRenderer()
    const html = writer.render(parser.parse(source || ""))
    const sanitized = sanitizer(html)

    if ( !source || !html || !sanitized ) {
        return null
    }

    return (
      <ReactMarkdown
        source={sanitized}
        className={"renderedMarkdown"}
      />
    )
  }
  return null
})