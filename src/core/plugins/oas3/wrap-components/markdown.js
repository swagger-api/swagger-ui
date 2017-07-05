import React from "react"
import ReactMarkdown from "react-markdown"
import { OAS3ComponentWrapFactory } from "../helpers"
import { sanitizer } from "core/components/providers/markdown"

export default OAS3ComponentWrapFactory(({ source }) => { return source ? (
  <ReactMarkdown
    source={sanitizer(source)}
    className={"renderedMarkdown"}
    />
) : null})
