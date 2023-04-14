/**
 * @prettier
 */
import React from "react"
import { createOnlyOAS31ComponentWrapper } from "../fn"

const JSONSchema202012KeywordDescriptionWrapper =
  createOnlyOAS31ComponentWrapper(({ schema, getComponent }) => {
    if (!schema.description) return null

    const MarkDown = getComponent("Markdown")

    return (
      <div className="json-schema-2020-12__description">
        <MarkDown source={schema.description} />
      </div>
    )
  })

export default JSONSchema202012KeywordDescriptionWrapper
