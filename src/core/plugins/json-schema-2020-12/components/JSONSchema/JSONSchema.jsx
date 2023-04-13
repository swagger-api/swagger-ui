/**
 * @prettier
 */
import React, { useState, useCallback } from "react"
import PropTypes from "prop-types"

import * as propTypes from "../../prop-types"
import { useComponent, useFn } from "../../hooks"

const JSONSchema = ({ schema, name }) => {
  const [expanded, setExpanded] = useState(false)

  const fn = useFn()
  const BooleanJSONSchema = useComponent("BooleanJSONSchema")
  const Accordion = useComponent("Accordion")

  const handleExpansion = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  if (fn.isBooleanJSONSchema(schema)) {
    return <BooleanJSONSchema schema={schema} name={name} />
  }

  return (
    <article className="json-schema-2020-12">
      <div className="json-schema-2020-12-head">
        <Accordion expanded={expanded} onChange={handleExpansion}>
          <div className="json-schema-2020-12__title">
            {name || fn.getTitle(schema)}
          </div>
        </Accordion>
      </div>
      {expanded && (
        <div className="json-schema-2020-12-body">
          <div className="json-schema-2020-12-property">
            <article className="json-schema-2020-12 json-schema-2020-12--embedded">
              <div className="json-schema-2020-12-head">
                <span className="json-schema-2020-12__title">property1</span>
                <span className="json-schema-2020-12__type">Object</span>
                <span className="json-schema-2020-12__format">int64</span>
                <span className="json-schema-2020-12__limit">[0...100]</span>
                <div className="json-schema-2020-12__description">
                  Whether to turn on or off the light.
                </div>
              </div>
              <div className="json-schema-2020-12-body">
                <div className="json-schema-2020-12-property">
                  <article className="json-schema-2020-12 json-schema-2020-12--embedded">
                    <div className="json-schema-2020-12-head">
                      <span className="json-schema-2020-12__title">
                        property11
                      </span>
                      <span className="json-schema-2020-12__type">Object</span>
                    </div>
                  </article>
                </div>
                <div className="json-schema-2020-12-property">
                  <article className="json-schema-2020-12 json-schema-2020-12--embedded">
                    <div className="json-schema-2020-12-head">
                      <span className="json-schema-2020-12__title">
                        property22
                      </span>
                      <span className="json-schema-2020-12__type">Object</span>
                    </div>
                  </article>
                </div>
                <div className="json-schema-2020-12-note">
                  Additional properties are allowed.
                </div>
              </div>
            </article>
          </div>
          <div className="json-schema-2020-12-property">
            <article className="json-schema-2020-12 json-schema-2020-12--embedded">
              <div className="json-schema-2020-12-head">
                <span className="json-schema-2020-12__title">property2</span>
                <span className="json-schema-2020-12__type">Object</span>
              </div>
            </article>
          </div>
          <div className="json-schema-2020-12-property">
            <article className="json-schema-2020-12 json-schema-2020-12--embedded">
              <div className="json-schema-2020-12-head">
                <span className="json-schema-2020-12__title">property3</span>
                <span className="json-schema-2020-12__type">Object</span>
              </div>
            </article>
          </div>
          <div className="json-schema-2020-12-note">
            Additional properties are allowed.
          </div>
        </div>
      )}
    </article>
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
