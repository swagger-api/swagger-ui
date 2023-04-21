/**
 * @prettier
 */
import React, { useCallback, useState } from "react"

import { schema } from "../../../prop-types"
import { useFn, useComponent, useIsExpandedDeeply } from "../../../hooks"

const OneOf = ({ schema }) => {
  const oneOf = schema?.oneOf || []

  if (!Array.isArray(oneOf) || oneOf.length === 0) {
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
    <div className="json-schema-2020-12__oneOf">
      <Accordion expanded={expanded} onChange={handleExpansion}>
        <span className="json-schema-2020-12-core-keyword json-schema-2020-12-core-keyword--oneOf">
          One of
        </span>
        <span className="json-schema-2020-12__type">
          {fn.getType({ oneOf })}
        </span>
      </Accordion>
      {expanded && (
        <ul>
          {oneOf.map((schema, index) => (
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

OneOf.propTypes = {
  schema: schema.isRequired,
}

export default OneOf
