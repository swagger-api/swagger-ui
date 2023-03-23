/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const VersionStampWrapper = createOnlyOAS31ComponentWrapper(
  ({ originalComponent: Original, ...restProps }) => (
    <span>
      <Original {...restProps} />
      <small className="version-stamp">
        <pre className="version">OAS 3.1</pre>
      </small>
    </span>
  )
)

export default VersionStampWrapper
