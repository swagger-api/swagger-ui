/**
 * @prettier
 */
import React from "react"
import { createOnlyOAS31ComponentWrapper } from "../../../fn"

const DescriptionWrapper = createOnlyOAS31ComponentWrapper(
  ({ schema, getComponent }) => {
    if (!schema?.description) return null

    const MarkDown = getComponent("Markdown")

    return (
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--description">
        <div className="json-schema-2020-12-core-keyword__value json-schema-2020-12-core-keyword__value--secondary">
          <MarkDown source={schema.description} />
        </div>
      </div>
    )
  }
)

export default DescriptionWrapper
