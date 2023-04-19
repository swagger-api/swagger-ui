/**
 * @prettier
 */
import React, { useCallback, useState } from "react"

import { schema } from "../../../prop-types"
import { useComponent, useIsExpandedDeeply } from "../../../hooks"

const $defs = ({ schema }) => {
  const $defs = schema?.$defs || {}

  if (Object.keys($defs).length === 0) {
    return null
  }

  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpandedDeeply)
  const Accordion = useComponent("Accordion")
  const JSONSchema = useComponent("JSONSchema")

  const handleExpansion = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  return (
    <div className="json-schema-2020-12__$defs">
      <Accordion expanded={expanded} onChange={handleExpansion}>
        <span className="json-schema-2020-12-core-keyword">$defs</span>
        <span className="json-schema-2020-12__type">object</span>
      </Accordion>
      {expanded && (
        <ul>
          {Object.entries($defs).map(([schemaName, schema]) => (
            <li key={schemaName} className="json-schema-2020-12-$def">
              <JSONSchema name={schemaName} schema={schema} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

$defs.propTypes = {
  schema: schema.isRequired,
}

export default $defs
