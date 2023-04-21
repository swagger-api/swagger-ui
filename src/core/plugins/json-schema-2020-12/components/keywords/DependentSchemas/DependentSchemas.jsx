/**
 * @prettier
 */
import React, { useCallback, useState } from "react"

import { schema } from "../../../prop-types"
import { useComponent, useIsExpandedDeeply } from "../../../hooks"

const DependentSchemas = ({ schema }) => {
  const dependentSchemas = schema?.dependentSchemas || []

  if (typeof dependentSchemas !== "object") return null
  if (Object.keys(dependentSchemas).length === 0) return null

  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpandedDeeply)
  const Accordion = useComponent("Accordion")
  const JSONSchema = useComponent("JSONSchema")

  const handleExpansion = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  return (
    <div className="json-schema-2020-12__dependentSchemas">
      <Accordion expanded={expanded} onChange={handleExpansion}>
        <span className="json-schema-2020-12-core-keyword json-schema-2020-12-core-keyword--dependentSchemas">
          Dependent schemas
        </span>
        <span className="json-schema-2020-12__type">object</span>
      </Accordion>
      {expanded && (
        <ul>
          {Object.entries(dependentSchemas).map(([schemaName, schema]) => (
            <li key={schemaName} className="json-schema-2020-12-property">
              <JSONSchema name={schemaName} schema={schema} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

DependentSchemas.propTypes = {
  schema: schema.isRequired,
}

export default DependentSchemas
