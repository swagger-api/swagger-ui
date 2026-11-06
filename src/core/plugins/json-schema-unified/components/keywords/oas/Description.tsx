/**
 * @prettier
 */
import React from "react"
import classNames from "classnames"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"
import { toSchemaObject } from "../../../fn"
import { DESCRIPTION, KEYWORD } from "../../../styles"
import type { KeywordProps } from "../../../types"

/**
 * OpenAPI 3.1/3.2 `description`: CommonMark, rendered only through the
 * system `Markdown` component (core provider, sanitized with DOMPurify),
 * which the system HOC puts into every instance's components. Without it
 * (e.g. a bare `withJSONSchemaUnifiedContext` instance) the description is
 * rendered as escaped plain text, never as HTML.
 */
const OASDescription = ({ schema }: KeywordProps) => {
  const description = toSchemaObject(schema).description
  const Markdown = useComponent("Markdown")

  if (!description) return null

  return (
    <div
      className={classNames(KEYWORD, DESCRIPTION)}
      data-keyword="description"
    >
      <div>
        {Markdown ? <Markdown source={description} /> : String(description)}
      </div>
    </div>
  )
}

OASDescription.propTypes = {
  schema: schema.isRequired,
}

export default OASDescription
