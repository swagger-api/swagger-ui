/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"
import { KEYWORD, KEYWORD_NAME } from "../../styles"
import type { KeywordProps } from "../../types"

const PropertyNames = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "propertyNames")) return null

  const name = <span className={KEYWORD_NAME.primary}>Property names</span>

  return (
    <div className={KEYWORD} data-keyword="propertyNames">
      <JSONSchema
        name={name}
        schema={schema.propertyNames}
        identifier="propertyNames"
      />
    </div>
  )
}

PropertyNames.propTypes = {
  schema: schema.isRequired,
}

export default PropertyNames
