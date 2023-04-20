/**
 * @prettier
 */
import React, { useCallback, useState } from "react"

import { schema } from "../../../prop-types"
import { useFn, useComponent, useIsExpandedDeeply } from "../../../hooks"

const AllOf = ({ schema }) => {
  const allOf = schema?.allOf || []

  if (!Array.isArray(allOf) || allOf.length === 0) {
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
    <div className="json-schema-2020-12__allOf">
      <Accordion expanded={expanded} onChange={handleExpansion}>
        <span className="json-schema-2020-12-core-keyword json-schema-2020-12-core-keyword--allOf">
          AllOf
        </span>
        <span className="json-schema-2020-12__type">
          {fn.getType({ allOf })}
        </span>
      </Accordion>
      {expanded && (
        <ul>
          {allOf.map((schema, index) => (
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

AllOf.propTypes = {
  schema: schema.isRequired,
}

export default AllOf
