/**
 * @prettier
 */
import React, { useCallback, useState } from "react"

import { schema } from "../../../prop-types"
import { useFn, useComponent, useIsExpandedDeeply } from "../../../hooks"

const AnyOf = ({ schema }) => {
  const anyOf = schema?.anyOf || []

  if (!Array.isArray(anyOf) || anyOf.length === 0) {
    return null
  }

  const fn = useFn()
  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpandedDeeply)
  const Accordion = useComponent("Accordion")
  const JSONSchema = useComponent("JSONSchema")

  const handleExpansion = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  return (
    <div className="json-schema-2020-12__anyOf">
      <Accordion expanded={expanded} onChange={handleExpansion}>
        <span className="json-schema-2020-12-core-keyword json-schema-2020-12-core-keyword--anyOf">
          AnyOf
        </span>
        <span className="json-schema-2020-12__type">
          {fn.getType({ anyOf })}
        </span>
      </Accordion>
      {expanded && (
        <ul>
          {anyOf.map((schema, index) => (
            <li key={`#${index}`} className="json-schema-2020-12-property">
              <JSONSchema
                name={`#${index} ${fn.getTitle(schema)}`}
                schema={schema}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

AnyOf.propTypes = {
  schema: schema.isRequired,
}

export default AnyOf
