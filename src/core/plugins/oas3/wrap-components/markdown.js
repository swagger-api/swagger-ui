import React from "react"
import ReactMarkdown from "react-markdown"
import { OAS3ComponentWrapFactory } from "../helpers"

export default OAS3ComponentWrapFactory(({ source }) => <ReactMarkdown source={source} />)
