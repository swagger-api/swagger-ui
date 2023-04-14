/**
 * @prettier
 */
import React, { useState, useCallback } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import * as propTypes from "../../prop-types"
import { useComponent, useFn, useLevel, useIsEmbedded } from "../../hooks"
import { JSONSchemaLevelContext } from "../../context"

const JSONSchema = ({ schema, name }) => {
  const [expanded, setExpanded] = useState(false)

  const fn = useFn()
  const [level, nextLevel] = useLevel()
  const isEmbedded = useIsEmbedded()
  const BooleanJSONSchema = useComponent("BooleanJSONSchema")
  const Accordion = useComponent("Accordion")
  const KeywordProperties = useComponent("KeywordProperties")

  const handleExpansion = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  if (fn.isBooleanJSONSchema(schema)) {
    return <BooleanJSONSchema schema={schema} name={name} />
  }

  return (
    <JSONSchemaLevelContext.Provider value={nextLevel}>
      <article
        data-json-schema-level={level}
        className={classNames("json-schema-2020-12", {
          "json-schema-2020-12--embedded": isEmbedded,
        })}
      >
        <div className="json-schema-2020-12-head">
          <Accordion expanded={expanded} onChange={handleExpansion}>
            <div className="json-schema-2020-12__title">
              {name || fn.getTitle(schema)}
            </div>
          </Accordion>
        </div>
        {expanded && (
          <div className="json-schema-2020-12-body">
            <KeywordProperties schema={schema} />
          </div>
        )}
      </article>
    </JSONSchemaLevelContext.Provider>
  )
}

JSONSchema.propTypes = {
  name: PropTypes.string,
  schema: propTypes.schema.isRequired,
}

JSONSchema.defaultProps = {
  name: "",
}

export default JSONSchema
