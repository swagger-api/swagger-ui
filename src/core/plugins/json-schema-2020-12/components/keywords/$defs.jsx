/**
 * @prettier
 */
import React, { useCallback, useState } from "react"

import { schema } from "../../prop-types"
import { useComponent, useIsExpandedDeeply } from "../../hooks"

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
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$defs">
      <Accordion expanded={expanded} onChange={handleExpansion}>
        <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
          $defs
        </span>
      </Accordion>
      <span className="json-schema-2020-12__type">object</span>
      {expanded && (
        <ul>
          {Object.entries($defs).map(([schemaName, schema]) => (
            <li key={schemaName} className="json-schema-2020-12-property">
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
