/**
 * @prettier
 */
import React from "react"

const Description = ({ schema, getSystem }) => {
  if (!schema?.description) return null

  const { getComponent } = getSystem()
  const MarkDown = getComponent("Markdown")

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--description">
      <div className="json-schema-2020-12-core-keyword__value json-schema-2020-12-core-keyword__value--secondary">
        <MarkDown source={schema.description} />
      </div>
    </div>
  )
}

export default Description
