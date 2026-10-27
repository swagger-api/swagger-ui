/**
 * @prettier
 */
import React from "react"

import { hasKeyword, stringifyAsWritten } from "../../fn"
import type { KeywordProps } from "./types"

/**
 * `$recursiveRef`, kept by the JSON Schema 2020-12 default meta-schema from
 * 2019-09, shown as written like `$dynamicRef` (a copy of the
 * json-schema-2020-12 renderer's `$dynamicRef` component), which replaced it
 * "with behavior modification"; swagger-client doesn't resolve it:
 * https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01.html#appendix-G-2.4.1.5
 */
const $recursiveRef = ({ schema }: KeywordProps) => {
  if (!hasKeyword(schema, "$recursiveRef")) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$recursiveRef">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
        $recursiveRef
      </span>
      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
        {stringifyAsWritten(schema.$recursiveRef)}
      </span>
    </div>
  )
}

export default $recursiveRef
