/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useFn } from "../../../hooks"

const Enum = ({ schema }) => {
  const fn = useFn()

  if (!Array.isArray(schema?.enum)) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--enum">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
        Allowed values
      </span>
      <ul>
        {schema.enum.map((element) => {
          const strigifiedElement = fn.stringify(element)

          return (
            <li key={strigifiedElement}>
              <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--const">
                {strigifiedElement}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

Enum.propTypes = {
  schema: schema.isRequired,
}

export default Enum
