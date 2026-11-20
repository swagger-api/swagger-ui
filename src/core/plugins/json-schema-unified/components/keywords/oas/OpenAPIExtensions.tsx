/**
 * @prettier
 */
import React from "react"

import { useComponent } from "../../../hooks"

export interface OpenAPIExtensionsProps {
  /** The OpenAPI object (`xml`, `discriminator`, `externalDocs`) carrying the extensions. */
  openAPISpecObj: Record<string, unknown>
  /** The `x-*` field names of `openAPISpecObj` to render. */
  openAPIExtensions: string[]
}

/**
 * Specification Extensions of an OpenAPI object, one JSON viewer each in the
 * extension tone (`.json-schema-2020-12-json-viewer-extension-keyword`).
 * Each viewer's `data-keyword` is the extension name.
 */
const OpenAPIExtensions = ({
  openAPISpecObj,
  openAPIExtensions,
}: OpenAPIExtensionsProps) => {
  const JSONViewer = useComponent("JSONViewer")

  return (
    <>
      {openAPIExtensions.map((keyword) => (
        <JSONViewer
          key={keyword}
          name={keyword}
          value={openAPISpecObj[keyword]}
          tone="extension"
          keyword={keyword}
        />
      ))}
    </>
  )
}

export default OpenAPIExtensions
