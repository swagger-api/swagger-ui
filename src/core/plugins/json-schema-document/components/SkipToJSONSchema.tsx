/**
 * @prettier
 */
import React from "react"

import { JSON_SCHEMA_DOCUMENT_ID } from "../fn"

const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault()

  // Scope the lookup to this Swagger UI instance so the link works when
  // multiple instances are mounted on the same page.
  const target = event.currentTarget
    .closest(".swagger-ui")
    ?.querySelector<HTMLElement>(`#${JSON_SCHEMA_DOCUMENT_ID}`)

  if (target) {
    target.focus()
    target.scrollIntoView()
  }
}

/**
 * The skip link of a JSON Schema document page, which has no `#operations`
 * region for "Skip to operations" to target.
 */
const SkipToJSONSchema = () => (
  <a
    href={`#${JSON_SCHEMA_DOCUMENT_ID}`}
    className="swagger-ui__skip-link"
    onClick={handleClick}
  >
    Skip to JSON Schema
  </a>
)

export default SkipToJSONSchema
