/**
 * @prettier
 */
import React from "react"

import { hasKeyword, stringifyAsWritten } from "../../fn"
import type { KeywordProps } from "./types"

/**
 * `$recursiveAnchor`, kept by the JSON Schema 2020-12 default meta-schema from
 * 2019-09, shown as written like `$dynamicAnchor` (a copy of the
 * json-schema-2020-12 renderer's `$dynamicAnchor` component), which replaced
 * it "with behavior modification":
 * https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01.html#appendix-G-2.4.1.5
 * The 2020-12 meta-schema takes an anchor string; 2019-09's boolean shows as
 * `true` or `false`.
 */
const $recursiveAnchor = ({ schema }: KeywordProps) => {
  if (!hasKeyword(schema, "$recursiveAnchor")) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$recursiveAnchor">
      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
        $recursiveAnchor
      </span>
      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
        {stringifyAsWritten(schema.$recursiveAnchor)}
      </span>
    </div>
  )
}

export default $recursiveAnchor
